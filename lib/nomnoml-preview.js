'use babel';

import NomnomlPreviewView from './nomnoml-preview-view';

import { CompositeDisposable } from 'atom';
import url from 'url';

const NOMNOML_PREVIEW_URI_PROTOCOL = 'nomnoml-viewer:';

export default {

  subscriptions: null,

  activate (state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nomnoml-preview:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.workspace.addOpener(this.nomnomlPreviewOpener));
  },

  deactivate () {
    this.subscriptions.dispose();
  },

  serialize () {

  },

  toggle () {
    console.log('NomnomlPreview was toggled!');

    if (this.isNomnomlPreviewView(atom.workspace.getActivePaneItem())) {
      atom.workspace.destroyActivePaneItem();
      console.log('Viewer destroyed');
      return;
    }

    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    const uri = this.createNomnomlPreviewUri(editor);
    const viewer = atom.workspace.paneForURI(uri);

    if (!viewer) {
      this.addPreviewForUri(uri);
    } else {
      console.log('Viewer destroyed');
      viewer.destroyItem(viewer.itemForURI(uri));
    }
  },

  addPreviewForUri (uri) {
    const prevActivePane = atom.workspace.getActivePane();
    const options = { searchAllPanes: true, split: 'right' };

    atom.workspace.open(uri, options).then((viewerView) => {
      if (this.isNomnomlPreviewView(viewerView)) {
        prevActivePane.activate();
      }
    });
  },

  createNomnomlPreviewUri (editor) {
    return NOMNOML_PREVIEW_URI_PROTOCOL + '//editor/' + editor.id;
  },

  nomnomlPreviewOpener (uri) {
    try {
      var parsedUri = url.parse(uri);
    } catch (err) { return; }

    if (parsedUri.protocol !== NOMNOML_PREVIEW_URI_PROTOCOL) return;

    console.log('Create new Preview');
    const editorId = parsedUri.pathname.substring(1);
    return new NomnomlPreviewView(uri, editorId);
  },

  isNomnomlPreviewView (object) {
    return (object instanceof NomnomlPreviewView);
  }

};
