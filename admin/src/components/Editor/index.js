import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import EditorJS from '@editorjs/editorjs';

import './styles.css';

const Editor = ( {
  // error,
  name,
  onChange,
  value,
} ) => {
  const editor = useRef( null );
  const editorRef = useRef( null );

  const editorStyles = {
    paddingTop: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: '1px solid #dcdce4',
    borderRadius: '4px',
  };

  const emptyValue = {
    blocks: [],
    time: Date.now(),
    version: EditorJS.version,
  };

  const handleReady = () => {
    if ( ! value ) {
      return;
    }

    let data = {};

    // Either use saved editor data or convert a string value into a data object.
    try {
      data = JSON.parse( value );
    } catch ( _err ) {
      data = {
        ...emptyValue,
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: `${value}`,
            },
          },
        ],
      };
    }

    const blocks = data?.blocks ?? [];

    if ( blocks?.length ) {
      editor.current.render( data );
    }
  };

  const handleChange = async () => {
    const data = await editor.current.save();

    onChange( {
      target: {
        name,
        value: JSON.stringify( data ),
        type: 'wysiwyg',
      },
    } );
  };

  useEffect( () => {
    editor.current = new EditorJS( {
      minHeight: 16,
      data: value ?? emptyValue,
      holder: editorRef.current,
      logLevel: 'VERBOSE',
      onReady: handleReady,
      onChange: handleChange, // () => handleChange(),
      // tools,
    } );

    return () => editor.current && editor.current.destroy();
  }, [] );

  return <div ref={ editorRef } style={ editorStyles } />;
};

Editor.propTypes = {
  // error: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default memo( Editor );
