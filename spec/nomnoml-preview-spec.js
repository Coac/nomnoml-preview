'use babel';

import NomnomlPreview from '../lib/nomnoml-preview';
import NomnomlPreviewView from '../lib/nomnoml-preview-view';

describe('NomnomlPreview', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('nomnoml-preview');
  });

  describe('when the nomnoml-preview:toggle event is triggered', () => {
    it('should create a pane', () => {
      waitsForPromise(() => {
        return activationPromise;
      });
      waitsForPromise(function () {
        return atom.workspace.open('file.txt');
      });

      runs(() => {
        expect(atom.workspace.getPanes()).toHaveLength(1);
      });

      atom.commands.dispatch(workspaceElement, 'nomnoml-preview:toggle');

      // TODO : make this better
      setTimeout(function () {
        runs(() => {
          expect(atom.workspace.getPanes()).toHaveLength(2);
        });
      }, 1000);
    });
  });
});
