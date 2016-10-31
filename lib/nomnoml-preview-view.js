'use babel';

import { CompositeDisposable } from 'atom';
import { View } from 'atom-space-pen-views';
import nomnoml from 'nomnoml';

class NomnomlPreviewView extends View {

  static content () {
    this.div({ outlet: 'container' }, () => {
      this.div({ outlet: 'canvas'});
    });
  }

  constructor (uri, editorId) {
    super();

    this.uri = uri;
    this.editorId = editorId;
    this.subscriptions = new CompositeDisposable();

    this.resolve = () => {
      if (!this.editor) {
        this.editor = getEditorForId(editorId);
      }
    };

    if (atom.workspace) this.resolve();
    else this.subscriptions.add(atom.packages.onDidActivateInitialPackages(this.resolve));

    var src = '[nomnoml] is -> [awesome]';
    this.canvas.html(nomnoml.renderSvg(src));
  }

  serialize () {
    return {
      deserializer: 'NomnomlPreviewView',
      editorId: this.editorId
    };
  }

  destroy () {
    this.subscriptions.dispose();
  }

  getTitle () {
    return 'Nomnoml Preview';
  }

  getURI () {
    return this.uri;
  }

  getPath () {
    return 'palceholder';
    return this.editor.getPath();
  }

  isEqual (other) {
    return other instanceof NomnomlPreviewView &&
      this.getURI() === other.getURI();
  }

}

function getEditorForId (editorId) {
  var editors = atom.workspace.getTextEditors();
  for (var i in editors) {
    var editor = editors[i];
    if (editor.id.toString() === editorId.toString()) return editor;
  }
}

export default NomnomlPreviewView;
