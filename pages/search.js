// This is the Link API
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';


const source = 'the-irish-times';
const apikey = '37bfdcf596424592bbede62502efc6b5'; //ew

const Search = props => (
    <div>
        <h2>Search Results</h2>
        {props.articles.map((article, index) => (
          <section>
            <h3>{article.title}</h3>
            <img src={article.urlToImage} alt="Article Image" className="img-article" />
            <p>{article.description}</p>
            <p>{article.content}</p>
            <p><Link href={article.url}><a>Read More @ {article.source.name}</a></Link></p>
          </section>
        ))}

        <style jsx>{`
          section {
            width: 50%;
            border: 1px solid gray;
            background-color: rgb(240,248,255);
            padding: 1em;
            margin: 1em;
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
          
        `}</style>
    </div>
  );
  
  Search.getInitialProps = async function(req) {
  const url = `https://newsapi.org/v2/everything?q=${req.query.s}&apiKey=${apikey}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log(data);

  return{
    articles: data.articles
  }
}


export default Search;
