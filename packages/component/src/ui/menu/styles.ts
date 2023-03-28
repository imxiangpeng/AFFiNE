import { ArrowRightSmallIcon } from '@blocksuite/icons';
import type { CSSProperties } from 'react';

import { displayFlex, styled } from '../../styles';
import StyledPopperContainer from '../shared/Container';

export const StyledMenuWrapper = styled(StyledPopperContainer)<{
  width?: CSSProperties['width'];
}>(({ theme, width }) => {
  return {
    width,
    background: theme.colors.popoverBackground,
    padding: '8px 4px',
    fontSize: '14px',
    backgroundColor: theme.colors.popoverBackground,
    boxShadow: theme.shadow.popover,
  };
});

export const StyledArrow = styled(ArrowRightSmallIcon)({
  position: 'absolute',
  right: '12px',
  top: 0,
  bottom: 0,
  margin: 'auto',
  fontSize: '20px',
});

export const StyledMenuItem = styled('button')<{
  isDir?: boolean;
  disabled?: boolean;
}>(({ theme, isDir = false, disabled = false }) => {
  return {
    width: '100%',
    borderRadius: '5px',
    padding: '0 14px',
    fontSize: theme.font.base,
    height: '32px',
    ...displayFlex('flex-start', 'center'),
    cursor: isDir ? 'pointer' : '',
    position: 'relative',
    backgroundColor: 'transparent',
    color: disabled ? theme.colors.disableColor : theme.colors.textColor,
    svg: {
      color: disabled ? theme.colors.disableColor : theme.colors.iconColor,
    },
    ...(disabled
      ? {
          cursor: 'not-allowed',
          pointerEvents: 'none',
        }
      : {}),

    ':hover': disabled
      ? {}
      : {
          color: theme.colors.primaryColor,
          backgroundColor: theme.colors.hoverBackground,
          svg: {
            color: theme.colors.primaryColor,
          },
        },
  };
});
