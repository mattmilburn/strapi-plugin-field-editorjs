import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import EditorJS from '@editorjs/editorjs';
import { Flex, Stack } from '@strapi/design-system';
import { Field, FieldError, FieldHint, FieldLabel } from '@strapi/design-system/Field';

import { LabelAction, StyledEditor } from './styled.js';
import tools from '../../tools';

const Editor = ( {
  description,
  disabled,
  error,
  id,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
} ) => {
  const { formatMessage } = useIntl();
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

  const errorMessage = error ? formatMessage( { id: error, defaultMessage: error } ) : '';

  const hint = description
    ? formatMessage(
        { id: description.id, defaultMessage: description.defaultMessage },
        { ...description.values }
      )
    : '';

  const label = intlLabel.id
    ? formatMessage(
        { id: intlLabel.id, defaultMessage: intlLabel.defaultMessage },
        { ...intlLabel.values }
      )
    : name;

  useEffect( () => {
    if ( editor.current ) {
      editor.current.readOnly.toggle();
    }
  }, [ disabled ] );

  useEffect( () => {
    editor.current = new EditorJS( {
      minHeight: 16,
      data: value ?? emptyValue,
      holder: editorRef.current,
      logLevel: 'VERBOSE',
      readOnly: disabled,
      onReady: handleReady,
      onChange: handleChange,
      tools,
    } );

    return () => editor.current && editor.current.destroy();
  }, [] );

  return (
    <Field name={ name } error={ error } hint={ hint } id={ id }>
      <Stack size={ 1 }>
        <Flex>
          <FieldLabel required={ required }>{ label }</FieldLabel>
          { labelAction && (
            <LabelAction paddingLeft={ 1 }>
              { labelAction }
            </LabelAction>
          ) }
        </Flex>
        <StyledEditor ref={ editorRef } />
        <FieldHint />
        <FieldError />
      </Stack>
    </Field>
  );
};

Editor.defaultProps = {
  description: null,
  disabled: false,
  error: undefined,
  id: undefined,
  labelAction: undefined,
  name: '',
  required: false,
  value: '',
};

Editor.propTypes = {
  description: PropTypes.shape( {
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  } ),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  intlLabel: PropTypes.shape( {
    id: PropTypes.string.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    values: PropTypes.object,
  } ).isRequired,
  labelAction: PropTypes.element,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Editor;
