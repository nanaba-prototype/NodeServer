function TestLabManager() {
    PrintLogMessage("TestLabManager", "TestLabManager", "init", LOG_LEVEL_INFO)
    $(".sub-links").click(function(){
        htmlDataPath = $(this).attr("data-html")
        testFeatureName = $(this).text()
        testLabManager.LoadAnotherPage(htmlDataPath, testFeatureName)
    })
    this.tempData = null
}

TestLabManager.prototype.LoadAnotherPage = function(pagePath, testFeatureName) {
    PrintLogMessage("TestLabManager", "LoadAnotherPage", "load another page url: " + pagePath + " name: " + testFeatureName, LOG_LEVEL_INFO)
    $("#test-content").load(pagePath)
    $("#test-feature-name").text(testFeatureName)
}

TestLabManager.prototype.SaveTempData = function (tempData) {
    this.tempData = tempData
}

TestLabManager.prototype.LoadTempData = function () {
    return this.tempData
}