import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  ListView,
  Dimensions
} from 'react-native';
import {   
  RkButton,
  RkModalImg,
  RkText,
  RkStyleSheet
 } from 'react-native-ui-kitten';
import * as api from '../../utils/api';

class WelfareView extends Component {
  static displayName = 'WelfareView';

  constructor(props){
    super(props)
    
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false,
      ds: ds.cloneWithRows([]),
    };

    let {width} = Dimensions.get('window')
    this.imgSize = (width - 16) / 3
  }

  static navigationOptions = {
    title: '福利',
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
    this.props.navigate({routeName: 'WelfareStack'});
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest() {
    const { page } = this.state
    const url = '/data/福利/99/' + page
    this.setState({ loading: true })

    setTimeout(() => {
      api.get(url, true).then(result => {
        let data = page === 1 ? result.results : [...this.state.data, ...result.results]
        this.setState({
          data: data,
          error: result.error || null,
          loading: false,
          refreshing: false,
          ds: this.state.ds.cloneWithRows(data)
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

  _renderHeader(options) {
    return (
      <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
        <RkButton rkType='clear' onPress={options.closeImage}>关闭</RkButton>
      </View>
    );
  }

  renderListItem = (rowData, sectionID, rowID) => {
    return (
      <RkModalImg 
        style={{width: this.imgSize, height: this.imgSize}}
        imgContainerStyle={{backgroundColor:'green'}} source={{uri:rowData.url + '?imageView2/0/w/200'}}
        backgroundColor={{backgroundColor:'green'}}
        renderHeader={this._renderHeader}/>
    )
  }

  _renderGallery() {
    return (
      <ListView
        pageSize={3}
        enableEmptySections={true}
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
        scrollRenderAheadDistance={500}
        dataSource={this.state.ds}
        onEndReachedThreshold={100}
        onEndReached={this.handleLoadMore}
        renderRow={this.renderListItem}
      />
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView
          automaticallyAdjustContentInsets={true}>
          <View>
            <View style={[{paddingLeft: 2, paddingTop: 4}]}>
              {this._renderGallery()}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default WelfareView;