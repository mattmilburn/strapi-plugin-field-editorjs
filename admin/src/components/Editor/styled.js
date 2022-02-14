import styled from 'styled-components';

export const StyledEditor = styled.div`
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.danger600 : theme.colors.neutral200)};
  border-radius: ${({ theme }) => theme.borderRadius};

  @media ( min-width: 768px ) {
    /* Remove max-width from editor and toolbar content. */
    .ce-block__content,
    .ce-toolbar__content {
      max-width: none;
    }
  }

  /* Keep toolbar content positioned on top of adjacent blocks. */
  .ce-toolbar--opened {
    z-index: 1;
  }
`;
