import React, { Component } from 'react';
import { TouchableOpacity, View, FlatList, Text, Image, ActivityIndicator } from 'react-native';
import { List } from 'native-base'; 
import { SearchBar } from 'react-native-elements';
import md5 from 'js-md5';

const PUBLIC_KEY = 'c66526e4b5c77ea063bc26fbe471d65e';
const PRIVATE_KEY = 'f1b9799633a26769435f44a16723ea7a9a4cfedb';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }

  static navigationOptions = {
    title: 'Heróis',
    headerStyle:{
      backgroundColor:'red'
    },
  }

  state = {
    loading: false,
    refreshing: false,
    data: [],
    limit: 10,
    offset: 0,
    error: null
  }

  componentDidMount() {
    this.callApi();
  }

  callApi = () => {
    console.log("callApi");
    const timestamp = new Date().getTime();
    const { limit, offset } = this.state;
    const hash = md5.create();

    hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);
    const url = 'https://gateway.marvel.com/v1/public/characters?ts=' + timestamp + '&orderBy=name&limit=' + limit + '&offset=' + offset + '&apikey=' + PUBLIC_KEY + '&hash=' + hash;
    
    this.setState({ loading: true });
    console.log("this.state.loading = " + this.state.loading);
    setTimeout(() => {
      return fetch(url).then(response => response.json()).then(response => {
        this.setState({data: limit === 10 ? response.data.results : 
          [...this.state.data, ...response.data.results],
          error: response.error || null, loading: false, refreshing: false});
      }).catch(error => {
        this.setState({ error, loading: false });
      })
    }, 1500);
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => this._onItemPress(item)} style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }} />
        <Text style={{ marginLeft: 10 }}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  handleLoadMore = () => {
    let nextPage = this.state.offset + 10;
    let quantPerPag = this.state.limit + 10;
    this.setState({
      offset: nextPage,
      limit: quantPerPag
      },
      () => {
        this.callApi();
      }
    );
  }

  handleRefresh = () => {
    let _limit = 10;
    let _offset = 0;
    let _refreshing = true;
    this.setState(
      {
        limit: _limit,
        offset: _offset,
        refreshing: _refreshing
      },
      () => {
        this.callApi();
      }
    );
    console.log("this.state = " + this.state);
  };

  renderFooter = () => {
    if(!this.state.loading) {
      return null;
    }
    return(
      <View style = {{ paddingVertical: 20, borderTopWidth: 1, borderColor: "#CED0CE" }}>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  renderHeader = () => {
    return <SearchBar noIcon placeholder='Search Here...' lightTheme round />
  };

  _onItemPress = (item) => {
    this.props.navigation.navigate('Descricao', { hero: item })
  }

  render() {
    return (
      <List>
        <FlatList data = {this.state.data} 
          renderItem  = {this._renderItem}
          keyExtractor = {(item) => item.id}
          ItemSeparatorComponent = {() => <View style={{ height: 1, backgroundColor: '#f7f7f7' }} />}
          ListHeaderComponent = { this.renderHeader }
          ListFooterComponent = { this.renderFooter }
          onRefresh = { this.handleRefresh }
          refreshing = { this.state.refreshing }
          onEndReached = { this.handleLoadMore }
          onEndReachedThreshold = {0.1}
        />
      </List>
    )
  }
}