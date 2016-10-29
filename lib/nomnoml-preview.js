'use babel';

import NomnomlPreviewView from './nomnoml-preview-view';
import { CompositeDisposable } from 'atom';

export default {

  nomnomlPreviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.nomnomlPreviewView = new NomnomlPreviewView(state.nomnomlPreviewViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.nomnomlPreviewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nomnoml-preview:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.nomnomlPreviewView.destroy();
  },

  serialize() {
    return {
      nomnomlPreviewViewState: this.nomnomlPreviewView.serialize()
    };
  },

  toggle() {
    console.log('NomnomlPreview was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
