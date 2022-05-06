import styled from 'styled-components';
import { Box } from '@strapi/design-system';

export const LabelAction = styled( Box )`
  svg path {
    fill: ${({ theme }) => theme.colors.neutral500};
  }
`;

export const StyledEditor = styled.div`
  padding-top: ${({ theme }) => theme.spaces[6]};
  padding-left: ${({ theme }) => theme.spaces[10]};
  padding-right: ${({ theme }) => theme.spaces[10]};
  padding-bottom: ${({ theme }) => theme.spaces[4]};
  background-color: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.danger600 : theme.colors.neutral200)};
  border-radius: ${({ theme }) => theme.borderRadius};

  /* Remove max-width from editor and toolbar content. */
  .ce-block__content,
  .ce-toolbar__content {
    max-width: none;
  }

  /* Give actions wrapper the full width. */
  .ce-toolbar__actions {
    height: 0;
    padding-right: 0;
    justify-content: space-between;
    left: -42px;
    right: -38px;
  }

  /* Keep toolbar content positioned on top of adjacent blocks. */
  .ce-toolbar--opened {
    z-index: 1;
  }

  /* Apply Strapi theme to plus button. */
  .ce-toolbar__plus {
    border-radius: 9999px;
    box-shadow: ${({ theme }) => theme.shadows.tableShadow};
    color: ${({ theme }) => theme.colors.neutral0};

    &,
    &:active {
      background-color: ${({ theme }) => theme.colors.primary600};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary500};
    }
  }

  /* Apply Strapi theme to settings button. */
  .ce-toolbar__settings-btn {
    background-color: ${({ theme }) => theme.colors.neutral0};
    border: 1px solid ${({ theme }) => theme.colors.neutral200};
    box-shadow: ${({ theme }) => theme.shadows.filterShadow};
    color: ${({ theme }) => theme.colors.neutral500};

    &--active,
    &:hover {
      border-color: ${({ theme }) => theme.colors.neutral600};
      color: ${({ theme }) => theme.colors.neutral600};
    }
  }

  /* Move settings dropdown menu to right side. */
  .ce-settings {
    max-width: 114px;
    left: auto;
    right: 0;
  }

  /* Enable flex layout with settings buttons. */
  .ce-settings-button-wrapper {
    display: inline-flex;
    position: relative;
  }

  /* Placeholder styles. */
  [data-placeholder]:empty::before {
    opacity: 0.4 !important;
    color: inherit !important;
    font-weight: normal;
    cursor: text;
    content: attr(data-placeholder);
  }

  /* Add spacing between blocks. */
  .ce-block:not(:last-child) .cdx-block {
    margin-bottom: 1em;
  }
`;
