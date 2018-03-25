import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import {RkCard} from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as api from '../../utils/api';

/**
 * Sample view to demonstrate StackNavigator
 * @TODO remove this module in a live application.
 */
class AndroidView extends Component {
  static displayName = 'AndroidView';

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false
    }
  }

  static navigationOptions = {
    title: 'Android',
    tabBarIcon: (props) => (
        <Icon name='color-lens' size={24} color={props.tintColor} />
      ),

    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#39babd'
    }
  }

  static propTypes = {
    navigate: PropTypes.func.isRequired
  };

  open = () => {
    this.props.navigate({routeName: 'AndroidStack'});
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest() {
    const { page } = this.state
    const url = '/data/Android/10/' + page
    this.setState({ loading: true })

    setTimeout(() => {
      api.get(url, true).then(result => {
        this.setState({
          data: page === 1 ? result.results : [...this.state.data, ...result.results],
          error: result.error || null,
          loading: false,
          refreshing: false
        })
      }).catch(error => {
        this.setState({ error, loading: false, refreshing: false })
      })
    }, 1500)
  }

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest()
      }
    )
  }

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.makeRemoteRequest()
    })
  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderListItem = ({item}) => {
    let itemView = <View />
    if (item.images) {
      itemView = <Image rkCardImg source={{uri:item.images[0]}}/>
    }

    return (
      <RkCard rkType='shadowed' style={styles.card}>
        <View rkCardHeader>
          <Text>{item.desc == null ? '' : item.desc}</Text>
        </View>
        {itemView}
        <View rkCardFooter>
          <Text>作者：{item.who == null ? '未知' : item.who}</Text>
        </View>
      </RkCard>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item._id}
          onEndReachedThreshold={100}
          onEndReached={this.handleLoadMore}
          ListFooterComponent={this.renderFooter}
          refreshControl={
            <RefreshControl
              colors={['#FF0000', '#0000FF']}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          renderItem={this.renderListItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   },
   card: {
     marginLeft: 10,
     marginRight: 10,
     marginTop: 10,
   }
});

export default AndroidView;