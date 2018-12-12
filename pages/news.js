// This is the Link API
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import SearchForm from '../components/SearchForm';
import Select from 'react-select';
const options = [
  { value: 'the-irish-times', label: 'The Irish Times' },
  { value: 'abc-news', label: 'ABC News' },
  { value: 'axios', label: 'AXIOS' }
];
const apikey = '37bfdcf596424592bbede62502efc6b5'; //ew
async function getNews(url) {
  // try fetch and catch any errors
  try {
    // Make async call
    const res = await fetch(url);
    // get json data when it arrives
    const data = await res.json();
    // return json data
    return data;
  } catch (error) {
    // return error if it occurs
    return error;
  }
}
function getDate(pub)
{
    let time = new Date(pub);
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
   return `Published On ${months[time.getMonth()]} ${time.getDay()} ${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`
}

export default class News extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newsSource: "",
      url: "",
      articles: []
    }
  }

  static async getInitialProps(req) {
    let source = 'the-irish-times'
    if(typeof req.query.source != "undefined")
      source=req.query.source;
    const url = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apikey}`; //EWWWWW
    const data = await getNews(url);
  
    if(Array.isArray(data.articles))
    {
      return{
        articles: data.articles,
        source: source
      }
    }
    else {
      console.error(data);
      req.statusCode = 400
      req.end(data.message);
    }
  }

  setNewsSource = (input) => {
    this.setState({
      newsSource: input,
      url: `https://newsapi.org/v2/top-headlines?sources=${input}&apiKey=${apikey}`
    })
  }

  searchNewsApi = (event) => {
    this.setState({
      newsSource: `${event.target.innerText}`,
      url: `https://newsapi.org/v2/${event.target.name}&apiKey=${apikey}`
    })
  }

  handleDropDown = (option) => {
    this.setState({
      newsSource: option.value,
      url: `https://newsapi.org/v2/top-headlines?sources=${option.value}&apiKey=${apikey}`
    })
  }

  async componentDidUpdate(prevPops, prevState)
  {
    if(this.state.url !== prevState.url)
    {
      const data = await getNews(this.state.url);
      if(Array.isArray(data.articles))
      {
        this.state.articles = data.articles;
        this.setState(this.state);
      }
    }
  }

  

  render() {
    if(this.state.articles.length == 0)
      this.state.articles = this.props.articles

    return (
      <div>
      <SearchForm setNewsSource={this.setNewsSource} />
      <Select
        onChange={this.handleDropDown}
        options={options}
      />
      <ul className="newsMenu">
        <li><a href="#" onClick={this.searchNewsApi} name="top-headlines?country=ie">Top Headlines Ireland</a></li>
        <li><a href="#" onClick={this.searchNewsApi} name="top-headlines?country=ie&category=business">Top Business News Ireland</a></li>
        <li><a href="#" onClick={this.searchNewsApi} name="top-headlines?country=ie&category=weather">Weather Ireland</a></li>
      </ul>
      <div className="newsItems">
      {this.state.articles.map((article, index) => (
        <section>
          <h3>{article.title}</h3>
          <em>{getDate(article.publishedAt)}</em>
          <img src={article.urlToImage} alt="No Provided Article Image" className="img-article" />
          <p>{article.description}</p>
          <p>{article.content}</p>
          {article.source.id !== null &&
            <p><Link href={`/story?id=${index}&source=${article.source.id}`}><a>Read More</a></Link></p>
          }
          <p><a href={article.url}>Read More on {article.source.name}</a></p>
        </section>
      ))}
      </div>
      <style jsx>{`
          section {
            width: 46%;
            border: 1px solid gray;
            background-color: rgb(240,248,255);
            padding: 1em;
            margin: 1em;
          }

          .newsItems{
            display: flex;
            flex-wrap: wrap;
          }

          .author {
            font-style: italic;
            font-size: 0.8em;
          }

          .img-article{
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-width: 50%
          }

          p{
            text-align: justify;
            text-justify: inter-word;
          }

          .newsMenu {
            display: flex;
            flex-direction: row;
            margin: 0;
            padding: 0;
            margin-top: 20px;
          }
          .newsMenu li {
            display: inline-table;
            padding-left: 20px;
          }
          .newsMenu li a {
            font-size: 1em;
            color: blue;
            display: block;
            text-decoration: none;
          }
          .newsMenu li a:hover {
            color: rgb(255, 187, 0);
            text-decoration: underline;
          }
          
        `}</style>
      </div>
    )
  }
}