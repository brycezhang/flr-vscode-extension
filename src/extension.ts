import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { FileExplorer } from './flr-view-data-provider';
import * as utils from './utils';
import * as FlrConstant from './FlrConstant';
import { FlrFileUtil } from './util/FlrFileUtil';
import * as yaml from 'yaml';
import { FlrCommand } from './FlrCommand';

export function activate(context: vscode.ExtensionContext) {
  console.log('[FLR] Extension is activating...');
  var fp: FileExplorer | undefined;

  function checkIsFlutterProject(): Promise<boolean> {
    return new Promise<boolean>((success, failure) => {
      let flutterProjectRootDir = FlrFileUtil.getFlutterMainProjectRootDir();
      console.log('[FLR] Flutter project root dir:', flutterProjectRootDir);

      if (flutterProjectRootDir === undefined) {
        console.log('[FLR] No Flutter project root directory found');
        success(false);
        return;
      }

      let pubspecFile = FlrFileUtil.getPubspecFilePath(flutterProjectRootDir);
      console.log('[FLR] Checking pubspec.yaml at:', pubspecFile);

      if (fs.existsSync(pubspecFile) === false) {
        console.log('[FLR] pubspec.yaml does not exist');
        success(false);
        return;
      }

      console.log('[FLR] Flutter project detected, initializing monitor...');
      fp?.readMD5OfPubspecInFolder();
      fp?.toggleMonitor(true);
      success(true);
    });
  }

  // make FLR show in Explorer Section
  utils.switchControl(utils.ControlFlags.isPubspecYamlExist, true);

  utils.registerCommandNice(context, utils.Commands.refresh, () => {
    console.log('[FLR] Manual refresh command triggered');
    fp?.refreshGeneratedResource(false);
  });

  utils.registerCommandNice(context, utils.Commands.init, async () => {
    console.log('[FLR] Init command triggered');
    try {
      await FlrCommand.initAll();
      console.log('[FLR] Init completed successfully');
    } catch (error) {
      console.error('[FLR] Init failed:', error);
      vscode.window.showErrorMessage(`[FLR] Init failed: ${error}`);
    }
  });

  fp = new FileExplorer(context);
  checkIsFlutterProject().then((isFlutterProject) => {
    console.log('[FLR] Is Flutter project:', isFlutterProject);
  });

  console.log('[FLR] Extension activated');
}
