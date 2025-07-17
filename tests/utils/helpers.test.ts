import { getFocusableElements, isElementDisabled, isElementVisible } from '@/utils/helpers';

describe('isElementDisabled', () => {
  it('returns false when element is null', () => {
    expect(isElementDisabled(null)).toBe(true);
  });

  it('returns true when element has disabled attribute', () => {
    const el = document.createElement('button');
    el.setAttribute('disabled', '');
    expect(isElementDisabled(el)).toBe(true);
  });
});

describe('isElementVisible', () => {
  it('returns false when element is null', () => {
    expect(isElementVisible(null)).toBe(false);
  });

  it('returns false when element has display: none', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    el.style.display = 'none';
    expect(isElementVisible(el)).toBe(false);
    document.body.removeChild(el);
  });
});

describe('getFocusableElements', () => {
  it('returns empty array if container is null', () => {
    expect(getFocusableElements(null)).toEqual([]);
  });

  it('returns only focusable elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button>OK</button>
      <input disabled />
      <a href="#">Link</a>
    `;
    document.body.appendChild(container);

    const result = getFocusableElements(container);
    expect(result.length).toBe(2);
    document.body.removeChild(container);
  });
});
