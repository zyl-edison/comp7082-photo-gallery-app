import cloudinary from 'cloudinary';
import Controller from './controller';
import path from 'path';

/**
 * VIDEO CONTROLLER CLASS
 */
class VideoController extends Controller {
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
          const {lat, lng} = JSON.parse(req.body.geolocation);
          const context = `lat=${lat}|lng=${lng}`;
          const video = await cloudinary.v2.uploader.upload(req.file.path, {
            resource_type: 'video',
            public_id: `caption_${Date.now()}`,
            folder: 'comp7082/photo-gallery',
            context,
          });
          res.status(201).send(video);
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }
      })();
    };
  }
}

// export a singleton object
export default new VideoController();
