/**
 * Nunjucks related utilities
 */
'use strict';

 module.exports = {

  /**
   * Gets information about an asset in a release. This is to be set as a
   * nunjucks global function which makes the downloadButtons macro easier to
   * implement.
   * 
   * @param {Object} release - The release object
   * @param {Object} asset - The asset object within the `release.assets` array
   * @returns {Object} info - the information about the asset
   * @returns {string} info.url - download url to the asset
   * @returns {string} info.iconId - id of the icon in the icons.svg file
   * @returns {Object|undefined} info.platform - target platform for the asset
   * @returns {string} info.platform.os - operating system name of the platform
   * @returns {string} info.platform.arch - bitness of the platform ('32' or '64')
   * @returns {string|undefined} info.name - descriptive name of the asset if platform is not present
   */
  getAssetInfo: (release, asset) => {
    var info = {};

    if (asset.url !== undefined) {
      info.url = asset.url;
    } else if (asset['github-asset'] !== undefined) {
      info.url = `https://github.com/stoneface86/trackerboy/releases/download/${release.version}/${asset['github-asset']}`;
    }

    switch (asset.name) {
      case 'linux64':
        info.iconId = 'linux';
        info.platform = { os: 'Linux', arch: '64' }
        break;
      case 'osx64':
        info.iconId = 'apple';
        info.platform = { os: 'MacOS', arch: '64' }
        break;
      case 'win64':
        info.iconId = 'windows';
        info.platform = { os: 'Windows', arch: '64' }
        break;
      case 'win32':
        info.iconId = 'windows';
        info.platform = { os: 'Windows', arch: '32' }
        break;
      case 'manual':
        info.iconId = 'book';
        info.name = 'User Manual';
        break;
      default:
        info.name = asset.name;
        break;
    }

    return info;
  }

}