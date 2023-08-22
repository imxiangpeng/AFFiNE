import type { App } from 'electron';
import path from 'path';

import { buildType, isDev } from './config';
import { logger } from './logger';
import {
  handleOpenUrlInHiddenWindow,
  restoreOrCreateWindow,
} from './main-window';
import { uiSubjects } from './ui';

let protocol = buildType === 'stable' ? 'affine' : `affine-${buildType}`;
if (isDev) {
  protocol = 'affine-dev';
}

export function setupDeepLink(app: App) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(protocol, process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient(protocol);
  }

  app.on('open-url', (event, url) => {
    if (url.startsWith(`${protocol}://`)) {
      event.preventDefault();
      handleAffineUrl(url).catch(e => {
        logger.error('failed to handle affine url', e);
      });
    }
  });

  // on windows & linux, we need to listen for the second-instance event
  app.on('second-instance', (event, commandLine) => {
    restoreOrCreateWindow()
      .then(() => {
        const url = commandLine.pop();
        if (url?.startsWith(`${protocol}://`)) {
          event.preventDefault();
          handleAffineUrl(url).catch(e => {
            logger.error('failed to handle affine url', e);
          });
        }
      })
      .catch(e => console.error('Failed to restore or create window:', e));
  });
}

async function handleAffineUrl(url: string) {
  logger.info('open affine url', url);
  const urlObj = new URL(url);
  logger.info('handle affine schema action', urlObj.hostname);
  // handle more actions here
  // hostname is the action name
  if (urlObj.hostname === 'sign-in') {
    const urlToOpen = urlObj.search.slice(1);
    if (urlToOpen) {
      await handleSignIn(urlToOpen);
    }
  }
}

async function handleSignIn(url: string) {
  if (url) {
    try {
      // tell main window to be at loading state
      const window = await handleOpenUrlInHiddenWindow(url);
      logger.info('opened url in popup', window.webContents.getURL());
      // check path
      // - if path === /auth/signIn, we know sign in succeeded
      // - if path === expired, we know sign in failed
      const finalUrl = new URL(window.webContents.getURL());
      console.log('final url', finalUrl);
      window.destroy();
      uiSubjects.onFinishLogin.next(finalUrl.pathname === '/auth/signIn');
    } catch (e) {
      logger.error('failed to open url in popup', e);
    }
  }
}
