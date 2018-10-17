import config from '@/js/config.js'
import constants from '@/js/constants.js'
import BaseApi from '@/js/BaseApi.js';

import UserProfileService from './UserProfileService.js'
import DocumentService from './DocumentService.js'
import ModeratorService from './ModeratorService.js'
import AssociationService from './AssociationService.js'
import FeedService from './FeedService.js'

function c2c(){
    // inherits properties
    BaseApi.call(this, config.urls.api)

    this.userProfile = new UserProfileService(this)
    this.moderator = new ModeratorService(this)
    this.association = new AssociationService(this)
    this.feed = new FeedService(this)

    for(let type of constants.documentTypes){
        this[type] = new DocumentService(this, type)
    }
}

// inherits prototype
c2c.prototype = Object.create(BaseApi.prototype);

// restore good contructor
c2c.prototype.constructor = c2c;

c2c.prototype.setToken = function(token){
    if(token){
        this.axios.defaults.headers.common.Authorization = 'JWT token="' + token + '"'
    } else if(this.axios.defaults.headers.common.Authorization){
        delete this.axios.defaults.headers.common.Authorization
    }
}

/* some function that not belong to a dedicated service */

c2c.prototype.search = function(params){
    return this.get('/search', {params})
}
c2c.prototype.getRecentChanges = function(params){
    return this.get('/documents/changes', {params})
}

/* TODO : these two function should not be here */
/* at least in a separated service, or in a vue component */
c2c.prototype.getSmallImageUrl = function(image){
    return config.urls.media + '/' + image.filename.replace('.', 'MI.').replace('.svg', '.jpg')
}
c2c.prototype.getImageUrl = function(image){
    return config.urls.media + '/' + image.filename
}

/* image service, I'm lazy. TODO :
 * uploadImage() must be a dedicated API in @/js/uploadFileApi.js
 * createImages() may not deserve a dedicated service, and can stay here
 */

/**
 * Upload images service
 */
c2c.prototype.uploadImage = function(file, onUploadProgress) {
    const formData = new FormData();

    formData.append('file', file);

    const requestConfig = {
        headers: {
            'Content-Type': undefined
        },
        onUploadProgress,
    }

    /* can't user post_ helper: it's not the API url */
    /* TODO : move this function in another service... */
    return this.axios.post(config.urls.imageBackend + '/upload', formData, requestConfig)
}

c2c.prototype.createImages = function(images){
    return this.post('/images/list', {images})
}

// export a singleton
export default new c2c();