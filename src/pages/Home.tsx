import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonNote, IonToolbar, IonText, IonTitle, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import './Home.css';

const Home: React.FC = () => {
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const newURL = 'http://chn.localhost/post-feeds-json?page='+page


  const generateItems = () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(newURL);
          const json = await response.json();
          setItems((prev: any) => [...prev, ...json.nodes]);
          console.log(json.nodes)
          setPage(page+1);
          setError(null);
          setLoading(false);
        } catch (error: any) {
          setError(error);
          setLoading(false);
        }
      };
  
      fetchData();
  
  };

  useEffect(() => {
    generateItems();
  }, []);

  const openBrowser = (item: string) => {
    const target = "_blank"

    const options = "location=yes,hidden=yes"

    const inAppBrowserRef = InAppBrowser.create(item, target, options)
    if (inAppBrowserRef != undefined) {

      inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;}" })

      inAppBrowserRef.show()
    }
  };

  const convertStringToHTML = (htmlString: string) => {
    const parser = new DOMParser();
    const html = parser.parseFromString(htmlString, 'text/html');
    const length = 100
    const textBody = html.body.textContent || '';

    if (textBody.length > length) {
      return `${textBody.substring(0, length)}...`;
    }
    return textBody;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Caribbean health news</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {items.map((item: any, index: any) => (
            <IonItem  onClick={() => openBrowser(item.node.field_feed_url)}  key={'item'+index}>
              <IonAvatar slot="start">
                <img src={item.node.field_image_url ? item.node.field_image_url : 'https://picsum.photos/80/80?random=' + index} alt="avatar" />
              </IonAvatar>
              <IonLabel className="ion-text-wrap">
                <IonNote>{ item.node.field_feed_source }</IonNote>
                <IonText><h2 className="ion-no-margin"><strong>{item.node.title}</strong></h2></IonText>
                <IonText><p>{ convertStringToHTML(item.node.body) }</p></IonText>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonInfiniteScroll
          onIonInfinite={(ev) => {
            generateItems();
            setTimeout(() => ev.target.complete(), 2000);
          }}
        >
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
  </IonPage>
  );
};

export default Home;
