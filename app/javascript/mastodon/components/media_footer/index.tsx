import { FormattedMessage } from 'react-intl';

import { Button } from '../button';

/**
 * Row of media controls rendered below a media attachment rather than on top
 * of it, so they never cover any part of the image or video
 */
export const MediaFooter: React.FC<{
  /** Badges shown on the starting side, e.g. alt text badges and media type labels */
  children?: React.ReactNode;
  onHide: () => void;
}> = ({ children, onHide }) => (
  <div className='media-footer'>
    <div className='media-footer__badges'>{children}</div>

    <Button
      contrastOnMedia
      size='xs'
      type='button'
      variant='solid'
      onClick={onHide}
    >
      <FormattedMessage id='media_gallery.hide' defaultMessage='Hide' />
    </Button>
  </div>
);
