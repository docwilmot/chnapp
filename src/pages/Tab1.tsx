import React, { useState, useEffect } from 'react';
import { IonContent, IonIcon, IonPage, IonHeader, IonNote, IonToolbar, IonText, IonTitle, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import './Tab1.css';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { sunnySharp } from 'ionicons/icons';

const Tab1: React.FC = () => {
  const [items, setItems] = useState<{node: Record<string, string>}[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState('');
  const [page, setPage] = useState(1);
  const newURL = 'http://chn.localhost/post-feeds-json?page='+page


  const generateItems = () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(newURL);
          const json = await response.json();
          setItems((prev: {node: Record<string, string>}[]) => [...prev, ...json.nodes]);
          setPage(page+1);
          setError('');
          setLoading(false);
        } catch (error: unknown) {
          if (typeof(error) == 'string') {
            setError(error);
          }
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
        <IonToolbar class="ion-margin-horizontal">
          <IonIcon slot="start" color="warning" aria-hidden="true" icon={sunnySharp} />
          <IonTitle>Caribbean news</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {
          // eslint-disable-next-line
          items.map((item: any, index: number) => (
            <IonItem  onClick={() => openBrowser(item.node.field_feed_url)}  key={'item'+index}>
              <IonAvatar slot="start">
                <img src={item.node.field_image_url ? item.node.field_image_url : 'https://picsum.photos/80/80?random=' + index} alt="avatar" />
              </IonAvatar>
              <IonLabel>
                <IonNote>{ item.node.field_feed_source }</IonNote>
                <IonText><h2 className="ion-no-margin"><strong>{item.node.title}</strong></h2></IonText>
                <IonText><p className="ion-text-wrap">{ convertStringToHTML(item.node.body) }</p></IonText>
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

export default Tab1;
