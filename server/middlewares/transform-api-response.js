'use strict';

const { get, has, head, isArray, isString } = require( 'lodash' );

const { getService, isApiRequest } = require( '../utils' );

// Transform function which is used to transform the response object.
const transform = ( data, config ) => {
  // Single entry.
  if ( has( data, 'attributes' ) ) {
    return transform( data.attributes, config );
  }

  // Collection of entries.
  if ( isArray( data ) && data.length && has( head( data ), 'attributes' ) ) {
    return data.map( item => transform( item, config ) );
  }

  // Loop through properties.
  Object.entries( data ).forEach( ( [ key, value ] ) => {
    if ( ! value ) {
      return;
    }

    // Single component.
    if ( has( value, 'id' ) ) {
      data[ key ] = transform( value, config );
    }

    // Repeatable component or dynamic zone.
    if ( isArray( value ) && has( head( value ), 'id' ) ) {
      data[ key ] = value.map( component => transform( component, config ) );
    }

    // Finally, if this is a JSON string, parse it into a JSON object.
    // We're just going to assume it is JSON if it begins and ends with {}.
    //
    // @TODO - Find a less lazy way to target the right fields.
    if ( isString( value ) && /^\{.*\}$/.test( value ) ) {
      try {
        let json = JSON.parse( value );

        // Maybe remove time prop.
        if ( config.response.removeTime ) {
          delete json.time;
        }

        // Maybe remove version prop.
        if ( config.response.removeVersion ) {
          delete json.version;
        }

        data[ key ] = json;
      } catch ( e ) {
        // Do nothing.
      }
    }
  } );

  return data;
};

// Transform API response by parsing data string to JSON for rich text fields.
module.exports = async ( { strapi } ) => {
  strapi.server.use( async ( ctx, next ) => {
    const config = await getService( 'config' ).getConfig();

    const shouldTransformResponse = (
      ! config.response ||
      ! config.response.format ||
      config.response.format !== 'json'
    );

    await next();

    if ( ! ctx.body || shouldTransformResponse ) {
      return;
    }

    if ( ctx.body.data && isApiRequest( ctx ) ) {
      ctx.body.data = transform( ctx.body.data, config );
    }
  } );
};
