import { fromJS } from 'immutable';

import type { ApiMediaAttachmentJSON } from '@/mastodon/api_types/media_attachments';
import MediaGallery from '@/mastodon/components/media_gallery';
import { mediaAttachmentFactoryAPI } from '@/testing/factories';
import { render, screen, fireEvent } from '@/testing/rendering';

type AttachmentData = Partial<
  Pick<ApiMediaAttachmentJSON, 'type' | 'description'>
>;

const mediaList = (attachments: AttachmentData[]) =>
  fromJS(
    attachments.map((data, i) =>
      mediaAttachmentFactoryAPI({ id: `${i + 1}`, ...data }),
    ),
  );

const renderGallery = (
  attachments: AttachmentData[],
  props: Partial<React.ComponentProps<typeof MediaGallery>> = {},
) =>
  render(
    <MediaGallery
      media={mediaList(attachments)}
      height={110}
      onOpenMedia={vi.fn()}
      visible
      {...props}
    />,
  );

describe('<MediaGallery />', () => {
  it('renders the alt text badge and hide button below the media, not on top of it', () => {
    const { container } = renderGallery([
      { description: 'A cat sitting on a keyboard' },
    ]);

    const gallery = container.querySelector('.media-gallery');
    const footer = container.querySelector('.media-footer');

    expect(gallery?.querySelector('button')).toBeNull();
    expect(footer).not.toBeNull();
    expect(gallery?.contains(footer ?? null)).toBe(false);
    expect(footer?.contains(screen.getByRole('button', { name: 'ALT' }))).toBe(
      true,
    );
    expect(footer?.contains(screen.getByRole('button', { name: 'Hide' }))).toBe(
      true,
    );
  });

  it('renders the GIF label below the media, not on top of it', () => {
    const { container } = renderGallery([{ type: 'gifv' }]);

    expect(
      container.querySelector('.media-gallery')?.textContent,
    ).not.toContain('GIF');
    expect(container.querySelector('.media-footer')?.textContent).toContain(
      'GIF',
    );
  });

  it('numbers badges by position when there are multiple attachments', () => {
    const { container } = renderGallery([
      { type: 'gifv', description: 'First' },
      { type: 'image' },
      { type: 'image', description: 'Third' },
    ]);

    expect(
      [...container.querySelectorAll('.media-footer__group')].map((group) =>
        [...group.querySelectorAll('.media-gallery__alt__label')].map(
          (badge) => badge.textContent,
        ),
      ),
    ).toEqual([['GIF 1', 'ALT 1'], ['ALT 3']]);
  });

  it('does not render the footer when media is hidden', () => {
    const { container } = renderGallery([{ description: 'A cat' }], {
      visible: false,
    });

    expect(container.querySelector('.media-footer')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Hide' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'ALT' })).toBeNull();
  });

  it('calls onToggleVisibility when the hide button is clicked', () => {
    const onToggleVisibility = vi.fn();
    renderGallery([{}], { onToggleVisibility });

    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));

    expect(onToggleVisibility).toHaveBeenCalledTimes(1);
  });
});
