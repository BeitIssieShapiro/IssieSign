const mainJson = {
  "indexVersion": 1,
  "categories": [
    {
      "name": "FavoritesCategory",
      "translate": true,
      "id": "__favorites__",
      "themeId": "2",
      "imageName": "favorites.png",
      "words": []
    },
    {
      "name": "TutorialsCategory",
      "allowHide": true,
      "translate": true,
      "id": "__tutorials__",
      "themeId": "3",
      "imageName": "tutorials.png",
      "words": [
        {
          "name": "__tutorial_overview__",
          "id": "__tutorial_overview__",
          "translate": true,
          "category": "TutorialsCategory",
          "imageName": "tutorial-overview.jpg",
          "videoName": "https://www.issieapps.com/videos/tutorials/en/overview.mp4"
        },
        {
          "name": "__tutorial_editing__",
          "id": "__tutorial_editing__",
          "translate": true,
          "category": "TutorialsCategory",
          "imageName": "tutorial-editing.png",
          "videoName": "https://www.issieapps.com/videos/tutorials/en/editing.mp4"
        }
      ]
    }
  ]
};

exports.mainJson = mainJson