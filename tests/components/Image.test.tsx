import Image from '@components/Image';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Image', () => {
  describe('Rendering', () => {
    it('should render', () => {
      render(<Image></Image>);
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });
  });

  describe('onError Behavior', () => {
    it('should fallback to fallbackSrc on error', () => {
      const originalSrc = 'original.jpg';
      const fallbackSrc = 'fallback.jpg';

      render(<Image src={originalSrc} fallbackSrc={fallbackSrc} alt="test image" />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('src', originalSrc);

      fireEvent.error(img);
      expect(img).toHaveAttribute('src', fallbackSrc);
    });

    it('should call onError prop if provided and not fallback', () => {
      const originalSrc = 'original.jpg';
      const fallbackSrc = 'fallback.jpg';
      const onError = vi.fn();

      render(
        <Image src={originalSrc} fallbackSrc={fallbackSrc} alt="test image" onError={onError} />
      );
      const img = screen.getByRole('img');

      fireEvent.error(img);

      expect(onError).toHaveBeenCalled();
      expect(img).toHaveAttribute('src', originalSrc);
    });
  });
});
