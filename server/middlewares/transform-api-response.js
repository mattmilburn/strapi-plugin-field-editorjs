'use strict';

const { has, head, isArray, isString } = require( 'lodash' );

const { getService, isApiRequest } = require( '../utils' );

// Recursively traverse the data to parse JSON fields.
const traverse = data => {
  // Single entry.
  if ( has( data, 'attributes' ) ) {
    return traverse( data.attributes );
  }

  // Array of entries.
  if ( isArray( data ) && data.length && has( head( data ), 'attributes' ) ) {
    return data.map( item => traverse( item ) );
  }

  // Loop through properties.
  Object.entries( data ).forEach( ( [ key, value ] ) => {
    if ( ! value ) {
      return;
    }

    // Single component.
    if ( has( value, 'id' ) ) {
      data[ key ] = traverse( value );
    }

    // Repeatable component or dynamic zone.
    if ( isArray( value ) && has( head( value ), 'id' ) ) {
      data[ key ] = value.map( component => traverse( component ) );
    }

    // Finally, if this is a JSON string, parse it into a JSON object.
    // We're just going to assume it is JSON if it begins and ends with {}.
    //
    // @TODO - Find a less lazy way to target the right fields.
    if ( isString( value ) && /^\{.*\}$/.test( value ) ) {
      try {
        data[ key ] = JSON.parse( value );
      } catch ( e ) {
        // Do nothing.
      }
    }
  } );

  return data;
};

// Transform function which is used to transform the response object.
const transform = async ( strapi, ctx, next ) => {
  const config = await getService( 'config' ).getConfig();

  await next();

  if ( ! ctx.body || ! config.transformApiResponse ) {
    return;
  }

  if ( ctx.body.data && isApiRequest( ctx ) ) {
    ctx.body.data = traverse( ctx.body.data );
  }
};

// Transform API response by parsing data string to JSON for rich text fields.
module.exports = async ( { strapi } ) => {
  strapi.server.use( ( ctx, next ) => transform( strapi, ctx, next ) );
};
