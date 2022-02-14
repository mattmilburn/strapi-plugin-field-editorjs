import { pluginId, pluginName } from './utils';
import { Editor } from './components';

export default {
  register( app ) {
    // Override the `wysiwyg/richtext` field type.
    app.addFields( {
      type: 'wysiwyg',
      Component: Editor,
    } );

    app.registerPlugin( {
      id: pluginId,
      name: pluginName,
    } );
  },
};
