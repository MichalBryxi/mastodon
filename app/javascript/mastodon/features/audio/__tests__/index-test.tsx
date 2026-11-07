import { render, screen, fireEvent } from '@/testing/rendering';

import { Audio } from '../index';

const renderAudio = (props: Partial<React.ComponentProps<typeof Audio>> = {}) =>
  render(<Audio src='/audio.mp3' alt='A short boop' visible {...props} />);

describe('<Audio />', () => {
  it('renders the alt text badge and hide button below the player, not inside it', () => {
    const { container } = renderAudio();

    const player = container.querySelector('.audio-player');
    const footer = container.querySelector('.media-footer');
    const altButton = screen.getByRole('button', { name: 'ALT' });
    const hideButton = screen.getByRole('button', { name: 'Hide' });

    expect(footer?.contains(altButton)).toBe(true);
    expect(footer?.contains(hideButton)).toBe(true);
    expect(player?.contains(altButton)).toBe(false);
    expect(player?.contains(hideButton)).toBe(false);
  });

  it('calls onToggleVisibility when the hide button is clicked', () => {
    const onToggleVisibility = vi.fn();
    renderAudio({ onToggleVisibility });

    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));

    expect(onToggleVisibility).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['media is hidden', { visible: false }],
    ['editing', { editable: true }],
  ])('does not render the footer when %s', (_, props) => {
    const { container } = renderAudio(props);

    expect(container.querySelector('.media-footer')).toBeNull();
  });
});
