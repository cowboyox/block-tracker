import PropTypes from 'prop-types';
import React from 'react';

import buildTokenUrl from '../../tokens/util/build-token-url';
import Link from '../../../components/link';

const AssetLabel = ({ asset, condensed, linked, ...otherProps }) => {
  const assetLink =
    asset.type === 'erc-721'
      ? `https://opensea.io/assets/${asset.tokenAddress}/${asset.tokenId}`
      : buildTokenUrl(asset.tokenAddress);
  const children = condensed ? (
    <>
      {asset.tokenSymbol ? asset.tokenSymbol.toUpperCase() : 'Unknown'}
      {asset.tokenId && <> #{asset.tokenId}</>}
    </>
  ) : (
    <>
      {asset.tokenType || 'Unknown'} {asset.tokenId && <>#{asset.tokenId}</>}{' '}
      {asset.tokenSymbol && <>({asset.tokenSymbol.toUpperCase()})</>}
    </>
  );

  return linked ? (
    <Link href={assetLink} {...otherProps}>
      {children}
    </Link>
  ) : (
    <span {...otherProps}>{children}</span>
  );
};

AssetLabel.propTypes = {
  asset: PropTypes.shape({
    tokenAddress: PropTypes.string.isRequired,
    tokenId: PropTypes.number,
    tokenSymbol: PropTypes.string,
    tokenType: PropTypes.string,
    type: PropTypes.string.isRequired,
  }).isRequired,
  condensed: PropTypes.bool,
  linked: PropTypes.bool,
};

AssetLabel.defaultProps = {
  condensed: false,
  linked: true,
};

export default AssetLabel;
