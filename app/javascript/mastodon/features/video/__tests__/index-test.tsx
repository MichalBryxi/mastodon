import { render, screen, fireEvent } from '@/testing/rendering';

import { Video } from '../index';

const renderVideo = (props: Partial<React.ComponentProps<typeof Video>> = {}) =>
  render(<Video src='/video.mp4' alt='A short clip' visible {...props} />);

describe('<Video />', () => {
  it('renders the alt text badge and hide button below the player, not on top of it', () => {
    const { container } = renderVideo();

    const player = container.querySelector('.video-player');
    const footer = container.querySelector('.media-footer');
    const altButton = screen.getByRole('button', { name: 'ALT' });
    const hideButton = screen.getByRole('button', { name: 'Hide' });

    expect(footer?.contains(altButton)).toBe(true);
    expect(footer?.contains(hideButton)).toBe(true);
    expect(player?.contains(altButton)).toBe(false);
    expect(player?.contains(hideButton)).toBe(false);
  });

  it('does not render the alt text badge when there is no description', () => {
    renderVideo({ alt: undefined });

    expect(screen.queryByRole('button', { name: 'ALT' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Hide' })).toBeTruthy();
  });

  it('calls onToggleVisibility when the hide button is clicked', () => {
    const onToggleVisibility = vi.fn();
    renderVideo({ onToggleVisibility });

    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));

    expect(onToggleVisibility).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['media is hidden', { visible: false }],
    ['in the media modal', { onCloseVideo: vi.fn() }],
    ['in picture-in-picture', { alwaysVisible: true }],
    ['editing', { editable: true }],
  ])('does not render the footer when %s', (_, props) => {
    const { container } = renderVideo(props);

    expect(container.querySelector('.media-footer')).toBeNull();
  });
});
