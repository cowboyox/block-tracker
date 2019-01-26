import { compose, mapProps } from 'recompose';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { TIME_PERIOD, URL } from '../../../constants';
import { media } from '../../../styles/util';
import buildTokenUrl from '../util/build-token-url';
import callApi from '../../../util/call-api';
import Card from '../../../components/card';
import ChartsContainer from '../../../components/charts-container';
import Fills from '../../fills/components/fills';
import PageLayout from '../../../components/page-layout';
import PageLoadingIndicator from '../../../components/page-loading-indicator';
import TokenVolume from '../../metrics/components/token-volume';

class TokenPage extends PureComponent {
  state = { loading: true };

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    const { tokenAddress } = this.props;

    if (prevProps.tokenAddress !== tokenAddress) {
      await this.fetchData();
    }
  }

  async fetchData() {
    const { tokenAddress } = this.props;

    let token;
    try {
      token = await callApi(`tokens/${tokenAddress}`);
    } catch (error) {
      // TODO: Bubble up non-404 errors to error boundary
      this.setState({
        loading: false,
        token: { address: tokenAddress, known: false },
      });
    }

    if (token) {
      this.setState({ loading: false, token: { ...token, known: true } });
    }
  }

  render() {
    const { loading, token } = this.state;

    if (loading) {
      return <PageLoadingIndicator />;
    }

    return (
      <>
        <Helmet>
          <title>{token.known ? token.name : 'Unknown Token'}</title>
        </Helmet>
        <PageLayout
          breadcrumbItems={[
            { title: 'Tokens', url: URL.TOKENS },
            {
              title: token.known ? token.name : 'Unknown Token',
              url: buildTokenUrl(token),
            },
          ]}
          title={token.known ? token.name : 'Unknown Token'}
        >
          {token.known ? (
            <ChartsContainer
              charts={[
                {
                  component: <TokenVolume token={token} />,
                  title: 'Network Volume',
                },
              ]}
              css={`
                margin: 0 0 1.25em 0;

                ${media.greaterThan('lg')`
              margin: 0 0 2em 0;
            `}
              `}
              defaultPeriod={TIME_PERIOD.MONTH}
              periods={[
                { label: '24H', value: TIME_PERIOD.DAY },
                { label: '7D', value: TIME_PERIOD.WEEK },
                { label: '1M', value: TIME_PERIOD.MONTH },
                { label: '1Y', value: TIME_PERIOD.YEAR },
                { label: 'ALL', value: TIME_PERIOD.ALL },
              ]}
            />
          ) : null}
          <Card css="flex-grow: 1;">
            <Fills filter={{ token: token.address }} />
          </Card>
        </PageLayout>
      </>
    );
  }
}

TokenPage.propTypes = {
  tokenAddress: PropTypes.string.isRequired,
};

const enhance = compose(
  mapProps(({ match }) => ({ tokenAddress: match.params.address })),
);

export default enhance(TokenPage);
