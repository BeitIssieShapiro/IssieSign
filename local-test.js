const index = `{
    "indexVersion": 1,
    "categories": [
        {
            "name": "FavoritesCategory",
            "translate": true,
            "id": "__favorites__",
            "themeId": "2",
            "imageName": "favorites.png",
            "words": [
                {
                    "name": "מילה 3",
                    "id": "מילה 3",
                    "category": "FavoritesCategory",
                    "imageName": "FavoritesCategory/מילה 3.jpg",
                    "videoName": "FavoritesCategory/מילה 3.mov",
                    "userContent": true,
                    "favorite": true,
                    "categoryId": "__favorites__"
                }
            ]
        },
        {
            "name": "חדש2",
            "id": "חדש2",
            "imageName": "חדש2/default.jpg",
            "words": [
                {
                    "name": "טט",
                    "id": "טט",
                    "category": "חדש2",
                    "imageName": "חדש2/טט.jpg",
                    "videoName": "חדש2/טט.mov",
                    "userContent": true,
                    "sync": "in-sync",
                    "videoFileId": "1mEfK2dA4XM73bVQb7sUJe7agHhSuWzeC",
                    "imageFileId": "15kUxGr3TbWuqQ4JtAKocby-NjNNx4gXq"
                },
                {
                    "name": "מילה שניה",
                    "id": "מילה שניה",
                    "category": "חדש2",
                    "imageName": "חדש2/מילה שניה.jpg",
                    "videoName": "חדש2/מילה שניה.mov",
                    "userContent": true,
                    "sync": "in-sync",
                    "videoFileId": "1Lx6abXVaLE5sI0ujBUfaffALfJBkc7JI",
                    "imageFileId": "1QKXvoSqjCd7GI2EX5M-Wu1NWxeuwTbaV"
                },
                {
                    "name": "מילה1",
                    "id": "מילה1",
                    "category": "חדש2",
                    "imageName": "חדש2/מילה1.jpg",
                    "videoName": "חדש2/מילה1.mov",
                    "userContent": true,
                    "sync": "in-sync",
                    "videoFileId": "18PEmKfSlYwDeMmADMu6av0Wj0kgd9nuV",
                    "imageFileId": "1sMWwW8CEKV8UM4pEVcjamxfzQ51l0NZC"
                }
            ],
            "userContent": true,
            "sync": "in-sync",
            "imageFileId": "1PukzmIMFZTFzf-kH5mdALkDd-aAs5iYd",
            "folderId": "1WiEbVrbiaJkDGXqyp_0AU34znYYU9Lot",
            "themeId": "11"
        },
        {
            "name": "יובל 1",
            "id": "יובל 1",
            "imageName": "יובל 1/default.jpg",
            "words": [
                {
                    "name": "מילה",
                    "id": "מילה",
                    "category": "יובל 1",
                    "imageName": "יובל 1/מילה.jpg",
                    "videoName": "יובל 1/מילה.mov",
                    "userContent": true,
                    "imported": true
                }
            ],
            "userContent": true,
            "imported": true,
            "themeId": 17
        },
        {
            "name": "בודק 3",
            "id": "בודק 3",
            "imageName": "בודק 3/default.jpg",
            "words": [
                {
                    "name": "בודק מילה",
                    "id": "בודק מילה",
                    "category": "בודק 3",
                    "imageName": "בודק 3/בודק מילה.jpg",
                    "videoName": "בודק 3/בודק מילה.mov",
                    "userContent": true,
                    "sync": "in-sync",
                    "imageFileId": "1SpAqoC5ATxbegxLwA24uftp2dMB2Tx36",
                    "videoFileId": "1Tasw_RBKrwDaz7hssxwi4Lweo6XE9aZk"
                }
            ],
            "userContent": true,
            "sync": "in-sync",
            "themeId": 16,
            "imageFileId": "1QX7ZZaxowjplrqNLIgX_E8r1IvpG9FHk",
            "folderId": "1o7uHR5h3jjMP2hxs-woRJoZudq7Rf-jc"
        }
    ]
}`
try {
    let p = JSON.parse(index)

    console.log(p.categories.length)
} catch (e) {
    console.log(e)
}