package gr.jcdenton;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;
//import android.Manifest;
//import android.content.ContentResolver;
import android.content.Intent;
import android.content.Context;

import android.app.Activity;

//import com.google.api.client.googleapis.json.GoogleJsonResponseException;
//import com.google.api.client.http.FileContent;
//import com.google.api.client.http.HttpRequestInitializer;
//import com.google.auth.http.HttpCredentialsAdapter;
//import com.google.api.client.http.javanet.NetHttpTransport;
//import com.google.api.client.json.gson.GsonFactory;
//import com.google.api.services.drive.Drive;
//import com.google.api.services.drive.model.File;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

import java.util.Objects;

import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

import com.google.api.services.drive.DriveScopes;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

public class GoogleDrive extends CordovaPlugin  {
    private static final String TAG = "GoogleDrivePlugin";
    private static final MediaType JSONMimeType = MediaType.parse("application/json; charset=utf-8");
    private static final int RC_SIGN_IN = 9001;
    private static final Scope DRIVE_FILE = new Scope(DriveScopes.DRIVE_FILE);
    private GoogleSignInClient mSignInClient;
    private GoogleSignInOptions mGoogleSignInOptions;
    private String mAction = "";
    private CallbackContext mCallbackContext;
    private JSONArray mArgs;
    private String action;
    private OkHttpClient okHttpClient;
    private JSONObject mAccessToken;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView){
        super.initialize(cordova, webView);
        this.cordova = cordova;

        GoogleSignInOptions options =
                new GoogleSignInOptions
                        .Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                        .requestServerAuthCode("972582951029-e7t8l63hrpg2beg1gbt5vq0i87bdm1tj.apps.googleusercontent.com", true)
                        .requestEmail()
                        .requestScopes(DRIVE_FILE)
                        .build();

        mSignInClient = GoogleSignIn.getClient(this.cordova.getActivity(), options);
        okHttpClient = new OkHttpClient();
        try {
            mAccessToken = getSavedAccessToken();
        } catch (JSONException e) {}

        cordova.setActivityResultCallback(this);
        Log.i(TAG,"Plugin initialized. Cordova has activity: " + cordova.getActivity());
    }

    private String getExceptionError(Exception e) {
        if (e != null) {
            return e.getMessage();
        }
        return "";
    }
    private Context getContext()  {
        return this.cordova.getActivity().getApplicationContext();
    }
    private Activity getActivity()  {
        return this.cordova.getActivity();
    }

    private boolean empty(String str) {
        return str == null || str.length() == 0;
    }

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        mCallbackContext = callbackContext;
        mArgs = args;
        mAction = action;
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());

        if ("whoAmI".equals(action)) {
            JSONObject flistJSON = new JSONObject();
            if (account != null) {
                String email = account.getEmail();
                try {
                    flistJSON.put("email", email);
                } catch (JSONException ex) {
                }
            } else {
                flistJSON.put("message", "Not logged in");
            }

            mCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, flistJSON));
            return true;
        } else  if ("logout".equals(action)) {
            if (account != null) {
                mSignInClient.signOut().addOnCompleteListener(this.cordova.getActivity(), new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if (task.isSuccessful()) {
                            mCallbackContext.success();
                            return;
                        } else {
                            Log.i(TAG, "Logout failed: " + getExceptionError(task.getException()));
                            mCallbackContext.error("Logout failed. " + getExceptionError(task.getException()));
                        }
                    }
                });
            }
            saveAccessToken(null);
            mAccessToken = null;
            return true;
        }

        if (getFreshTokenAndExecute(mAccessToken)) {
            return true;
        }

        Intent intent = mSignInClient.getSignInIntent();
        this.cordova.getActivity().startActivityForResult(intent, RC_SIGN_IN);

        return true;
    }



    private class FindFolder implements Runnable {
        private String bearerToken;
        private String folderName;
        private String parentFolderId;
        private CallbackContext callbackContext;


        FindFolder(String bearerToken, CallbackContext callbackContext,  String folderName, String parentFolderId) {
            this.bearerToken = bearerToken;
            this.folderName = folderName;
            this.parentFolderId = parentFolderId;
            this.callbackContext = callbackContext;
        }
        @Override
        public void run() {
            try {
                String qAddition = this.parentFolderId != null && this.parentFolderId.length() > 0  ?
                            String.format("and '%s' in parents", parentFolderId):
                            "";

                Request request = new Request.Builder()
                        .url(String.format("https://www.googleapis.com/drive/v3/files?q=trashed=false and mimeType='application/vnd.google-apps.folder' and name = '%s'%s&fields=nextPageToken,files(id,name,modifiedTime,trashed)", folderName, qAddition))
                        .addHeader("Authorization", "Bearer " + bearerToken)
                        .build();

                try (Response response = okHttpClient.newCall(request).execute()) {
                    if (response.isSuccessful()) {
                        JSONObject resObj = new JSONObject(response.body().string());
                        JSONArray files = resObj.getJSONArray("files");
                        JSONObject resultObj = new JSONObject();
                        resultObj.put("folders", files);
                        callbackContext.success(resultObj);
                    } else {
                        callbackContext.error("file.list resulted "+ response.code());
                    }
                }
            } catch (IOException e) {
                Log.i(TAG, "error http: " + e.toString());
                callbackContext.error("file.list resulted "+ e.toString());
            } catch (JSONException jsonE) {
                Log.i(TAG, "error http: " + jsonE.toString());
                callbackContext.error("file.list resulted "+ jsonE.toString());
            }
        }
    }

    class ListFiles implements Runnable {
        private String bearerToken;
        private String parentFolderId;
        private CallbackContext callbackContext;

        ListFiles(String bearerToken, CallbackContext callbackContext, String parentFolderId) {
            this.bearerToken = bearerToken;
            this.parentFolderId = parentFolderId;
            this.callbackContext = callbackContext;
        }

        @Override
        public void run() {
            try {

                Request request = new Request.Builder()
                        .url(String.format("https://www.googleapis.com/drive/v3/files?q=trashed=false and '%s' in parents&fields=nextPageToken,files(id,name,modifiedTime,trashed,mimeType)", parentFolderId))
                        .addHeader("Authorization", "Bearer " + bearerToken)
                        .build();

                try (Response response = okHttpClient.newCall(request).execute()) {
                    if (response.isSuccessful()) {
                        JSONObject resObj = new JSONObject(response.body().string());
                        JSONArray files = resObj.getJSONArray("files");
                        if (files.length() > 0) {
                            JSONObject resultObj = new JSONObject();
                            resultObj.put("files", files);
                            callbackContext.success(resultObj);
                        }
                    } else {
                        callbackContext.error("file.list resulted "+ response.code());
                    }
                }
            } catch (IOException e) {
                Log.i(TAG, "error http: " + e.toString());
                callbackContext.error("file.list resulted "+ e.toString());
            } catch (JSONException jsonE) {
                Log.i(TAG, "error http: " + jsonE.toString());
                callbackContext.error("file.list resulted "+ jsonE.toString());
            }
        }

    }

    class DownloadFile implements Runnable {
        private String bearerToken;
        private String fileId;
        private CallbackContext callbackContext;
        private String targetPath;

        DownloadFile(String bearerToken, CallbackContext callbackContext, String fileId, String targetPath) {
            this.bearerToken = bearerToken;
            this.fileId = fileId;
            this.callbackContext = callbackContext;
            this.targetPath = targetPath;
        }

        @Override
        public void run() {
            try {
                BinaryFileWriter bfw = new BinaryFileWriter(new FileOutputStream(targetPath), null);
                BinaryFileDownloader bfd = new BinaryFileDownloader(okHttpClient, bearerToken, bfw);
                bfd.download(String.format("https://www.googleapis.com/drive/v3/files/%s?alt=media", fileId));

                JSONObject resultObj = new JSONObject();
                resultObj.put("message", "File downloaded successfully and saved to path");
                resultObj.put("destPath", targetPath);

                callbackContext.success(resultObj);
            } catch (IOException e) {
                Log.i(TAG, "error http: " + e.toString());
                callbackContext.error("file.list resulted "+ e.toString());
            } catch (JSONException jsonE) {
                Log.i(TAG, "error http: " + jsonE.toString());
                callbackContext.error("file.list resulted "+ jsonE.toString());
            }
        }

    }

    class DeleteFile implements Runnable {
        private String bearerToken;
        private String fileId;
        private CallbackContext callbackContext;

        DeleteFile(String bearerToken, CallbackContext callbackContext, String fileId) {
            this.bearerToken = bearerToken;
            this.fileId = fileId;
            this.callbackContext = callbackContext;
        }

        @Override
        public void run() {
            try {

                String url = "https://www.googleapis.com/drive/v3/files/" + fileId;
                Request request = new Request.Builder()
                        .url(url)
                        .addHeader("Authorization", "Bearer " + bearerToken)
                        .delete()
                        .build();

                Response response = okHttpClient.newCall(request).execute();
                if (response.isSuccessful()) {
                    callbackContext.success();
                } else {
                    callbackContext.error("Error delete file. code" + response.code());
                }
            } catch (IOException e) {
                Log.i(TAG, "error http: " + getExceptionError(e));
                callbackContext.error("Error delete file. " + getExceptionError(e));
            }
        }
    }

    class RefreshTokenAndExecute implements Runnable {
        private JSONObject accessToken;

        RefreshTokenAndExecute(JSONObject accessToken) {
            this.accessToken = accessToken;
        }

        @Override
        public void run() {
            try {
                String refreshToken = accessToken.getString("refresh_token");
                JSONObject bodyJson = new JSONObject();
                bodyJson.put("client_id", "972582951029-e7t8l63hrpg2beg1gbt5vq0i87bdm1tj.apps.googleusercontent.com");
                bodyJson.put("client_secret", "");
                bodyJson.put("refresh_token", refreshToken);
                bodyJson.put("grant_type", "refresh_token");

                RequestBody formBody = RequestBody.create(bodyJson.toString(), JSONMimeType);

                Request request = new Request.Builder()
                        .url("https://www.googleapis.com/oauth2/v4/token")
                        .post(formBody)
                        .build();

                Response response = okHttpClient.newCall(request).execute();
                if (response.isSuccessful()) {
                    String newAccessToken = response.body().string();
                    JSONObject newEnhancedAccessToken = getEnhancedAccessToken (newAccessToken);
                    mAccessToken.put("expires_in", newEnhancedAccessToken.getInt("expires_in"));
                    mAccessToken.put("expiresAfter", newEnhancedAccessToken.getLong("expiresAfter"));
                    mAccessToken.put("access_token", newEnhancedAccessToken.getString("access_token"));
                    saveAccessToken(mAccessToken.toString());
                    String bearerToken = "";
                    execute(mAccessToken.getString("access_token"));
                } else {
                    Intent intent = mSignInClient.getSignInIntent();
                    cordova.getActivity().startActivityForResult(intent, RC_SIGN_IN);
                }
            } catch (JSONException e) {
                Log.e(TAG, "Cannot refresh token" + getExceptionError(e));
                mCallbackContext.error("Cannot refresh token" + getExceptionError(e));
            } catch (IOException e) {
                Log.e(TAG, "Cannot refresh token" + getExceptionError(e));
                mCallbackContext.error("Cannot refresh token" + getExceptionError(e));
            }
        }
    }

    class UploadFile implements Runnable {
        private String bearerToken;
        private CallbackContext callbackContext;
        private String folderId;
        private String targetPath;
        private String rootFolderId;
        private String rootFolderName;
        private String srcPath;

        UploadFile(String bearerToken, CallbackContext callbackContext,
                   String srcPath, String folderId, String targetPath, String rootFolderId, String rootFolderName) {
            this.bearerToken = bearerToken;
            this.callbackContext = callbackContext;
            this.srcPath = srcPath;
            this.folderId = folderId;
            this.targetPath = targetPath;
            this.rootFolderId = rootFolderId;
            this.rootFolderName = rootFolderName;
        }

        @Override
        public void run() {
            try {
                JSONObject resultObj = new JSONObject();

                // check file exists
                File f = new File(srcPath);
                if (!f.exists()) {
                    callbackContext.error("File not found: " + srcPath);
                    return;
                }

                if (empty(rootFolderId) && !empty(rootFolderName)) {
                    JSONObject folderJson = new JSONObject();
                    folderJson.put("mimeType", "application/vnd.google-apps.folder");
                    folderJson.put("name", rootFolderName);

                    RequestBody formBody = RequestBody.create(folderJson.toString(), JSONMimeType);

                    Request request = new Request.Builder()
                            .url("https://www.googleapis.com/drive/v3/files")
                            .addHeader("Authorization", "Bearer " + bearerToken)
                            .addHeader("Content-Type", "application/x-www-form-urlencoded")
                            .post(formBody)
                            .build();

                    Response rootFolderResponse = okHttpClient.newCall(request).execute();
                    if (rootFolderResponse.isSuccessful()) {
                        JSONObject resObj = new JSONObject(rootFolderResponse.body().string());
                        resultObj.put("rootFolderId", resObj.getString("id"));
                    } else {
                        callbackContext.error("root folder creation failed:" + rootFolderResponse.code());
                        return;
                    }
                }

                //if folderId empty - and targetPath has two parts folder/filename - create folder and return in folderId
                String targetPathParts[] = targetPath.split("/");
                String fileName = targetPath;
                if (empty(folderId) && targetPathParts.length > 1) {

                    fileName = targetPathParts[1];

                    JSONObject folderJson = new JSONObject();
                    folderJson.put("mimeType", "application/vnd.google-apps.folder");
                    folderJson.put("name", targetPathParts[0]);
                    JSONArray parents = new JSONArray();
                    parents.put(rootFolderId);
                    folderJson.putOpt("parents", parents);

                    RequestBody formBody = RequestBody.create(folderJson.toString(), JSONMimeType);


                    Request request = new Request.Builder()
                            .url("https://www.googleapis.com/drive/v3/files")
                            .addHeader("Authorization", "Bearer " + bearerToken)
                            .post(formBody)
                            .build();

                    Response folderResponse = okHttpClient.newCall(request).execute();
                    if (folderResponse.isSuccessful()) {
                        JSONObject resObj = new JSONObject(folderResponse.body().string());
                        folderId = resObj.getString("id");
                        resultObj.put("folderId", folderId);

                    } else {
                        callbackContext.error("folder creation failed:" + folderResponse.code());
                        return;
                    }
                }

                //create file - return fileId, folderId, created_date, File uploaded succesfully!" forKey:@"message
                //String url = String.format("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&parents['%s']&name=%s", folderId, fileName);
                //RequestBody fileRequestBody = f.asRequestBody(fileName.endsWith(".jpg")?  "image/jpeg" : "video/mpeg".toMediaType())
                //MediaType mt = MediaType.get(fileName.endsWith(".jpg")?  "image/jpeg" : "video/mpeg");
                String url = String.format("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart");
                JSONObject metadata = new JSONObject();
                metadata.put("name", fileName);
                JSONArray parents = new JSONArray();
                parents.put(folderId);
                metadata.putOpt("parents", parents);

                RequestBody metaDataBody = RequestBody.create(MediaType.parse("application/json"), metadata.toString());

                RequestBody requestBody = new MultipartBody.Builder()
                        .setType(MultipartBody.FORM)
                        .addFormDataPart("metadata", null, metaDataBody)
                        .addFormDataPart("file", null, RequestBody.create(MediaType.parse("application/octet-stream"), f))
                        .build();


                // RequestBody requestBody = new MultipartBody.Builder()
                //      .setType(MultipartBody.FORM)
                //        .addPart(RequestBody.create(f, mt))
                //        .build();

                Request request = new Request.Builder()
                        .url(url)
                        .addHeader("Authorization", "Bearer " + bearerToken)
                        .post(requestBody)
                        .build();
                String fileId = "";
                Response response = okHttpClient.newCall(request).execute();

                if (response.isSuccessful()) {
                    JSONObject resObj = new JSONObject(response.body().string());
                    fileId = resObj.getString("id");
                    //String creationTime = resObj.getString("createdTime");
                    resultObj.put("fileId", fileId);
                    resultObj.put("folderId", folderId);
                    //resultObj.put("created_date", creationTime);
                } else {
                    callbackContext.error("Error uploading file: " + response.code());
                    return;
                }
                //create permission
                JSONObject permJson = new JSONObject();
                permJson.put("type", "anyone");
                permJson.put("role", "reader");

                RequestBody formBody = RequestBody.create(permJson.toString(), JSONMimeType);

                Request permRequest = new Request.Builder()
                        .url(String.format("https://www.googleapis.com/drive/v3/files/%s/permissions", fileId))
                        .addHeader("Authorization", "Bearer " + bearerToken)
                        .post(formBody)
                        .build();

                Response permResponse = okHttpClient.newCall(permRequest).execute();
                if (permResponse.isSuccessful()) {
                    callbackContext.success(resultObj);
                } else {
                    callbackContext.error("failed to add permission: "+permResponse.code());
                }
            } catch (IOException e) {
                Log.i(TAG, "error http: " + e.toString());
                callbackContext.error("file.list resulted " + e.toString());
            } catch (JSONException jsonE) {
                Log.i(TAG, "error http: " + jsonE.toString());
                callbackContext.error("file.list resulted " + jsonE.toString());
            }
        }
    }


    public boolean execute(String bearerToken) throws JSONException {
        if ("findFolder".equals(mAction)) {
            String folderName = mArgs.getString(0);
            String parentFolderId = mArgs.getString(1);

            FindFolder ff = new FindFolder(bearerToken, mCallbackContext, folderName, parentFolderId);
            cordova.getThreadPool().execute(ff);
            return true;
        } else if ("fileList".equals(mAction)) {
            String parentFolderId = mArgs.getString(0);

            ListFiles lf = new ListFiles(bearerToken, mCallbackContext, parentFolderId);
            cordova.getThreadPool().execute(lf);
            return true;
        } else if ("downloadFile".equals(mAction)) {
            String targetPath = mArgs.getString(0);
            String fileId = mArgs.getString(1);
            boolean anonymousAccess = mArgs.getBoolean(2);

            DownloadFile df = new DownloadFile(bearerToken, mCallbackContext, fileId, targetPath);
            cordova.getThreadPool().execute(df);
            return true;
        } else if ("deleteFile".equals(mAction)) {
            String fileId = mArgs.getString(0);
            DeleteFile df = new DeleteFile(bearerToken, mCallbackContext, fileId);
            cordova.getThreadPool().execute(df);
            return true;
        } else if ("uploadFile".equals(mAction)) {
            //fpath, targetPath, folderId, rootFolderId, rootFolderName, appfolder,
            String srcPath = mArgs.getString(0);
            String targetPath = mArgs.getString(1);
            String folderId = mArgs.getString(2);
            String rootFolderId = mArgs.getString(3);
            String rootFolderName = mArgs.getString(4);
            boolean appFolder = mArgs.getBoolean(5);
            UploadFile uf = new UploadFile(bearerToken, mCallbackContext, srcPath, folderId, targetPath, rootFolderId, rootFolderName);
            cordova.getThreadPool().execute(uf);

            return true;
        }
        return false;
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task =
                    GoogleSignIn.getSignedInAccountFromIntent(data);
            if (task.isSuccessful()) {
                GoogleSignInAccount acct = task.getResult();
                String code = acct.getServerAuthCode();
                if (code != null) {
                    cordova.getThreadPool().execute(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                JSONObject newAccessToken = getAccessToken(code);
                                if (newAccessToken != null) {
                                    saveAccessToken(newAccessToken.toString());
                                    mAccessToken = newAccessToken;
                                    getFreshTokenAndExecute(mAccessToken);
                                }
                            } catch (JSONException e) {
                                Log.w(TAG, "error Execute plugin command" + e.toString());
                            } catch (Exception e) {
                                Log.w(TAG, "error getting access token" + e.toString());
                            }
                        }
                    });
                }
            } else {
                // Sign in failed, handle failure and update UI
                Log.i(TAG, "Sign in failed: " +getExceptionError(task.getException()));
                mCallbackContext.error(getExceptionError(task.getException()));
            }
        }
    }

    private boolean getFreshTokenAndExecute(JSONObject accessToken) {
        if (accessToken == null)
            return false;
        try {
            long expiresAfter =  accessToken.getLong("expiresAfter");
            if (System.currentTimeMillis() < expiresAfter) {
                String bearerToken = accessToken.getString("access_token");
                execute(bearerToken);
                return true;
            } else {
                //try to refresh the token on a different thread:
                accessToken.getString("refresh_token");
                RefreshTokenAndExecute rt = new RefreshTokenAndExecute(accessToken);
                cordova.getThreadPool().execute(rt);
                return true;

            }
        } catch (JSONException e) {
            Log.w(TAG, "error parse access token: "+ getExceptionError(e));
        }
        return false;
    }

    private JSONObject getAccessToken(String code) throws JSONException{
        RequestBody formBody = new FormBody.Builder()
                .add("code", code)
                .add("client_id", "972582951029-e7t8l63hrpg2beg1gbt5vq0i87bdm1tj.apps.googleusercontent.com")
                .add("client_secret", "")
                .add("grant_type", "authorization_code")
                .add("redirect_uri", "")
                .build();

        Request request = new Request.Builder()
                .url("https://www.googleapis.com/oauth2/v4/token")
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .post(formBody)
                .build();

        try (Response response = okHttpClient.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String accessToken =  response.body().string();
                return getEnhancedAccessToken(accessToken);
            }

            Log.w(TAG, "Error getting access token: errCode" + response.code());
        } catch (IOException e) {
            Log.i(TAG, "error getting access token: " + getExceptionError(e));
        }
        return null;
    }

    private JSONObject getEnhancedAccessToken(String accessToken) throws JSONException {
        JSONObject accTokenJson = new JSONObject(accessToken);
        long expires = accTokenJson.getInt("expires_in");
        long expiresAfter = (System. currentTimeMillis() / 1000 + expires - 10) * 1000; //spare of 10 sec.
        accTokenJson.put("expiresAfter", expiresAfter);
        return accTokenJson;
    }

    private JSONObject getSavedAccessToken() throws JSONException {
        String savedAT = PreferenceManager.getDefaultSharedPreferences(getContext()).getString("access_token", null);
        if (savedAT != null)
            return new JSONObject(savedAT);

        return null;
    }

    private void saveAccessToken(String token){
        SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(getContext()).edit();
        editor.putString("access_token", token);
        editor.commit();
    }
}

class BinaryFileWriter implements AutoCloseable {

    private static final int CHUNK_SIZE = 1024;
    private final OutputStream outputStream;
    private final ProgressCallback progressCallback;

    public BinaryFileWriter(OutputStream outputStream, @Nullable  ProgressCallback progressCallback) {
        this.outputStream = outputStream;
        this.progressCallback = progressCallback;
    }

    public long write(InputStream inputStream, double length) throws IOException {
        try (BufferedInputStream input = new BufferedInputStream(inputStream)) {
            byte[] dataBuffer = new byte[CHUNK_SIZE];
            int readBytes;
            long totalBytes = 0;
            while ((readBytes = input.read(dataBuffer)) != -1) {
                totalBytes += readBytes;
                outputStream.write(dataBuffer, 0, readBytes);
                if (progressCallback != null) {
                    progressCallback.onProgress(totalBytes / length * 100.0);
                }
            }
            return totalBytes;
        }
    }

    @Override
    public void close() throws IOException {
        outputStream.close();
    }
}

interface ProgressCallback {
    void onProgress(double progress);
}

class BinaryFileDownloader implements AutoCloseable {

    private final OkHttpClient client;
    private final BinaryFileWriter writer;
    private final String bearerToken;

    public BinaryFileDownloader(OkHttpClient client, String bearerToken, BinaryFileWriter writer) {
        this.client = client;
        this.writer = writer;
        this.bearerToken = bearerToken;
    }

    public long download(String url) throws IOException {
        Request request = new Request.Builder().url(url)
                .addHeader("Authorization", "Bearer "+bearerToken)
                .build();

        Response response = client.newCall(request).execute();
        ResponseBody responseBody = response.body();
        if (responseBody == null) {
            throw new IllegalStateException("Response doesn't contain a file");
        }
        double length = Double.parseDouble(Objects.requireNonNull(response.header("Content-Length", "1")));
        return writer.write(responseBody.byteStream(), length);
    }

    @Override
    public void close() throws Exception {
        writer.close();
    }
}
