'use babel';

import { CompositeDisposable } from 'atom';
import { View } from 'atom-space-pen-views';
import nomnoml from 'nomnoml';

class NomnomlPreviewView extends View {

  static content () {
    this.div({outlet: 'container', style: 'background-color: #fdf6e3;'}, () => {
      this.div({outlet: 'canvas', id: 'canvas'});
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

    this.updateCanvas();

    this.subscriptions.add(
      this.editor.getBuffer().onDidChange(
        () => {
          this.updateCanvas();
        }
      )
    );
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
    let title = 'Nomnoml';
    if (this.editor) {
      title = this.editor.getTitle();
    }
    return title + ' Preview';
  }

  getURI () {
    return this.uri;
  }

  getPath () {
    return this.editor.getPath();
  }

  isEqual (other) {
    return other instanceof NomnomlPreviewView &&
      this.getURI() === other.getURI();
  }

  updateCanvas () {
    try {
      var svg = nomnoml.renderSvg(this.editor.getText());
    } catch (e) {
      svg = e;
    }
    this.canvas.html(svg);
  }

}

function getEditorForId (editorId) {
  const editors = atom.workspace.getTextEditors();
  for (const i in editors) {
    const editor = editors[i];
    if (editor.id.toString() === editorId.toString()) return editor;
  }
}

export default NomnomlPreviewView;
