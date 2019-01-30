import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import {
  yml as ymlHelper,
  route as routeHelper,
} from './helpers';
import * as controllers from './controllers';

/**
 * SYSTEM CLASS
 */
class System {
  /**
   * CONSTRUCTOR
   *
   * @param {String} name     the name of the system instance
   * @param {String} version  the verison of the application
   * @param {String} rootPath code base root path
   */
  constructor(name, version, rootPath) {
    this.name = name;
    this.version = version;
    this.rootPath = rootPath;
    this.configs = ymlHelper.parse(`${__dirname}/config.yml`);
    this.port = this.configs.global.api.port;
    this.apiServer = this._createApiServer();
    this.apiServer.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
    this.apiServer.use(bodyParser.json({limit: '50mb', extended: true}))
  }

  /**
   * BUILD API ROUTES
   *
   * Create routes based on the configuration in yaml file and map each route
   * to the corresponding action of the controller
   *
   * @return {Array} a list routers
   */
  _buildApiRoutes() {
    const version = this.version;
    const {
      global: {api: globalApiConfig},
      [version]: {api: apiConfig},
    } = this.configs;

    const {prefix} = apiConfig;

    // TODO: Since it is a demo, assume global routes and current version routes
    //       are all unique. Skip overwrite global routes from current version
    //       routes
    const globalRoutes = globalApiConfig.routes || {};
    const routes = apiConfig.routes || {};

    return {
      prefix,
      routes: routeHelper.build(
        Object.assign(globalRoutes, routes),
        controllers,
      ),
    };
  }

  /**
   * BIND ROUTES
   */
  _bindApiRoutes({prefix, routes = []}) {
    if (!prefix) throw new Error('Missing api version prefix');
    this.apiServer.use(`/api/${prefix}`, routes);
  }

  /**
   * CREATE A WEB SERVER
   *
   * @return {Object} a server instance
   */
  _createApiServer() {
    return express();
  }

  /**
   * BIND CLIENT ROUTE
   */
  _bindClientRoute() {
    this.apiServer.use(express.static(path.join(this.rootPath, 'client')));
    this.apiServer.get('/', (req, res) => res.sendFile('index.html'));
  }

  /**
   * INIT
   *
   * Initialize the system
   */
  _init() {
    this._bindClientRoute();
    this._bindApiRoutes(this._buildApiRoutes());
  }

  /**
   * BOOT
   *
   * Boot different servers within system
   */
  boot() {
    const {port} = this;
    this._init();
    this.apiServer.listen(port, () => {
      console.log('Web server has been started at port ', port);
    });
  }
}

export default System;
