import cloudinary from 'cloudinary';
import Controller from './controller';
import {HttpError} from '../classes';
import {
  httpResponse as httpResponseHelper,
  validation as validationHelper,
} from '../helpers';

/**
 * PHOTO CONTROLLER CLASS
 */
class PhotoController extends Controller {
  /**
   * CONSTRUCTOR
   */
  constructor() {
    super();
    cloudinary.config({
      cloud_name: 'zyl-edison',
      api_key: '975232188527893',
      api_secret: 'HS1ISbI7Zy2m8_Yv3cjwwXJbd58'
    });
  }

  create() {
    return (req, res) => {
      (async () => {
        try {
          const {imageDataUrl, lat, lng} = req.body;
          const context = `lat=${lat}|lng=${lng}`;
          const photo = await cloudinary.v2.uploader.upload(imageDataUrl, {
            public_id: `caption_${Date.now()}`,
            folder: 'comp7082/photo-gallery',
            context,
          });
          res.status(201).send(photo);
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }
      })();
    };
  }

  acquire() {
    return (req, res) => {
      (async () => {
        try {
          const resourcesRes = await cloudinary.v2.api.resources({
            type: 'upload',
            prefix: 'comp7082/photo-gallery',
            context: true,
            max_results: 500,
          });
          const {resources} = resourcesRes;
          res.status(200).send(resources.filter((r) => {
            return !r.public_id.includes('no-image');
          }));
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }
      })();
    }
  }
}

// export a singleton object
export default new PhotoController();
