import styled from 'styled-components';
import { Box } from '@strapi/design-system';

export const LabelAction = styled( Box )`
  svg path {
    fill: ${({ theme }) => theme.colors.neutral500};
  }
`;

export const StyledEditor = styled.div`
  padding-top: ${({ theme }) => theme.spaces[4]};
  padding-left: ${({ theme }) => theme.spaces[4]};
  padding-right: ${({ theme }) => theme.spaces[4]};
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.danger600 : theme.colors.neutral200)};
  border-radius: ${({ theme }) => theme.borderRadius};

  @media ( min-width: 768px ) {
    /* Remove max-width from editor and toolbar content. */
    .ce-block__content,
    .ce-toolbar__content {
      max-width: none;
    }

    /* Keep actions toggle on the right. */
    .ce-toolbar__actions {
      right: 0;
    }
  }

  /* Keep toolbar content positioned on top of adjacent blocks. */
  .ce-toolbar--opened {
    z-index: 1;
  }

  /* Apply Strapi theme to settings button. */
  .ce-toolbar__settings-btn {
    background-color: ${({ theme }) => theme.colors.neutral0};
    border: 1px solid ${({ theme }) => theme.colors.neutral200};
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    color: ${({ theme }) => theme.colors.neutral500};
  }

  .ce-toolbar__settings-btn--active,
  .ce-toolbar__settings-btn:hover {
    border-color: ${({ theme }) => theme.colors.neutral600};
    color: ${({ theme }) => theme.colors.neutral600};
  }
`;
