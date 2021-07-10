import React from 'react'
import { View, Image, FlatList, TouchableOpacity, ScrollView, Text } from 'react-native'

import styles from '../styles'
import { colors, screenDimensions } from '../utilities/constants';
import { ListEmpty2 } from '../components/noDataFound'

export const CarouselUpdate = (props) => {
  console.log(props, "props------------>")
  const { items, style, catergoryData, visibleStatus, onContentSizeChange, renderItem } = props;
  const itemsPerInterval = props.itemsPerInterval === undefined
    ? 1
    : props.itemsPerInterval;

  const [interval, setInterval] = React.useState(1);
  const [intervals, setIntervals] = React.useState(1);
  const [width, setWidth] = React.useState(0);
  const scrollViewRef = React.useRef(null)
  const init = (width) => {
    // initialise width
    setWidth(width);
    // initialise total intervals
    const totalItems = items.length;
    setIntervals(Math.ceil(totalItems / itemsPerInterval));
    console.log(scrollViewRef, "scrollViewRef")
    // scrollViewRef.current.scrollResponderScrollToEnd()

  }

  const getInterval = (offset) => {
    for (let i = 1; i <= intervals; i++) {
      if (offset + 1 < (width / intervals) * i) {
        return i;
      }
      if (i == intervals) {
        return i;
      }
    }
  }

  let bullets = [];
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i}
        style={{
          ...styles.bullet,
          opacity: interval === i ? 0.5 : 0.1
        }}
      >
        &bull;
      </Text>
    );
  }

  const setSroll = (item) => {
    // alert("123")
    console.log(scrollViewRef.current,"scrollViewRef.current,")
    props.onPressCategory(item)
  }

  return (
    <View style={styles.container3}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ ...styles.scrollView, width: `${100 * intervals}%`, }}
        ref={scrollViewRef}
        // onContentSizeChange={onContentSizeChange}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(w, h) => init(w)}
        onScroll={data => {
          setWidth(data.nativeEvent.contentSize.width);
          setInterval(getInterval(data.nativeEvent.contentOffset.x));
        }}
        scrollEventThrottle={200}
        pagingEnabled
        decelerationRate="fast"
      >
        <View style={styles.stat}>

          {items.map((item, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => setSroll(item)} style={styles.stat}>

                {item && item.image ?
                  <View>
                    <Image
                      style={[{ height: 75, width: 75, }]}
                      resizeMode={'stretch'}
                      resizeMethod={'resize'}
                      // source={{ uri: 'https://eshop.arascamedical.com/wp-content/uploads/2019/07/31515-MobileAid%C2%AE-Easy-Roll-Modular-Trauma-First-Aid-Station-with-BleedStop-Compact-200-Bleeding-Control-Kit-600x600.jpg' }}
                      source={item && item.image  ? { uri: item.image } : require('../assets/img/greyscale.jpg')}
                    />
                  </View>
                  :
                  <View style={{ width: 75, height: 75 }} />

                }

                <Text style={[styles.statText, { paddingTop: 10, textAlign: 'center' }]} numberOfLines={2}>{item.category_name}</Text>


              </TouchableOpacity>
            )

          })}
        </View>
      </ScrollView>
      <FlatList
        bounces={false}
        extraData={catergoryData}
        pagingEnabled={true}
        autoplay={true}
        horizontal={true}
        snapToInterval={300}
        showsHorizontalScrollIndicator={false}
        data={catergoryData}
        keyExtractor={(item, index) => index + 'flatlist2123'}
        renderItem={renderItem}
        automaticallyAdjustContentInsets={true}

        ListEmptyComponent={
          (catergoryData.length == 0) ?
            ListEmpty2({ state: visibleStatus, margin: 50, content: true })
            :
            null
        }
      />
      <View style={styles.bullets}>
        {bullets}
      </View>
    </View>
  )
}

export default CarouselUpdate;