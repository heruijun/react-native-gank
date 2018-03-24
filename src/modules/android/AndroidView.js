import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import {RkCard} from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as api from '../../utils/api';

const color = () => Math.floor(255 * Math.random());

/**
 * Sample view to demonstrate StackNavigator
 * @TODO remove this module in a live application.
 */
class AndroidView extends Component {
  static displayName = 'AndroidView';

  constructor(props){
    super(props)
    this.state = {
      data: []
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

  componentWillMount() {
    api.get('/data/Android/10/1', true).then(result => {
      if(!result.error) {
        this.setState({
          data: result.results
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <RkCard rkType='shadowed' style={styles.card}>
              {/* {item.images ? (
                <Image rkCardImg source={{uri:item.images[0] + '?imageView2/0/w/100'}}/>
              ) : (
                <Text>暂无图片</Text>
              )} */}
              <View rkCardHeader>
                <Text>描述：{item.desc == null ? '无' : item.desc}</Text>
              </View>
              <View rkCardFooter>
                <Text>作者：{item.who == null ? '未知' : item.who}</Text>
              </View>
            </RkCard>
          )}
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