import React, { memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import EditorJS from '@editorjs/editorjs';

import { StyledEditor } from './styled.js';

const Editor = ( {
  // error,
  name,
  onChange,
  value,
} ) => {
  const editor = useRef( null );
  const editorRef = useRef( null );

  const emptyValue = {
    blocks: [],
    time: Date.now(),
    version: EditorJS.version,
  };

  // Handle ready-state logic for editor.
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

  // Handle change-state logic for editor.
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
      onChange: handleChange,
      // tools,
    } );

    return () => editor.current && editor.current.destroy();
  }, [] );

  return <StyledEditor ref={ editorRef } />;
};

Editor.propTypes = {
  // error: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default memo( Editor );
