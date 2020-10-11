import React, { Component } from 'react';
import './home.style.css';
import { render } from 'react-dom';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            featuredList: [],
            mediaData: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        fetch('https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=mwVisAfjpPW2kjGSQW21gO8qbAvkJzG8')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.results)) {
                    const mediaData = data.results.map(article => {
                        let imgArr = article.media.filter(media => media.type === "image");
                        imgArr = imgArr.length > 0 ? imgArr[0] : [];
                        return {
                            ...article,
                            images: imgArr["media-metadata"]
                        };
                    });
                    this.setState({
                        featuredList: mediaData,
                    });
                }
            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
            })

    }

    render() {
        return (<div className="container-fluid" id="home-page">
            <header>
                <div className="row" id="header-row">
                    <div className="col-sm-9">
                        <h1>News Portal</h1>
                    </div>
                    <div className="col-sm-3">
                        <input type="search" id="site-search" name="search-box" 
                        aria-label="Search through site content" placeholder="Search..."></input>
                    </div>
                </div>
            </header>
            <main className="row">
                <section className={this.state.errorMessage ? 'hide col-sm-7 offset-sm-1 feature' : 'col-sm-7 feature'}>
                    <h2 id="feature-heading">Featured News</h2>
                    <div className="container-fluid" id="news-list">
                    {this.state.featuredList.map((article, idx) => {
                        const stdImg = article.images ? article.images.filter(img => img.format === "Standard Thumbnail")[0] : {};
                        const medImg = article.images ? article.images.filter(img => img.format === "mediumThreeByTwo210")[0] : {};
                        const larImg = article.images ? article.images.filter(img => img.format === "mediumThreeByTwo440")[0] : {};
                        return (<div className="row" key={article.id}>
                            <div className="col-sm-2">
                                <picture>
                                    <source media="(min-width:576px)" srcSet={stdImg.url} alt="thumbnail" height={stdImg.height} width={stdImg.width} />
                                    <source media="(min-width:992px)" srcSet={medImg.url} alt="medium" height={medImg.height} width={medImg.width} />
                                    <source media="(min-width:1200px)" srcSet={larImg.url} alt="large" height={larImg.height} width={larImg.width} />
                                    <img src={stdImg.url} alt="thumbnail" height={stdImg.height} width={stdImg.width} />
                                </picture>
                            </div>
                            <div className="col-sm-10">
                                <h4>{article.title ? article.title : null}</h4>
                                <span><p>{article.abstract ? article.abstract : null}</p></span>
                            </div>
                        </div>);
                    })}
                    </div>
                </section>
                <div className="col-sm-1"></div>
                <aside className={this.state.errorMessage ? 'hide col-sm-4 feature' : 'col-sm-4 feature'}>
                    <h2>Latest News</h2>
                    <div className="container-fluid" id="latest-list">
                    {this.state.featuredList.map((article, idx) => {
                        return (<div className="row" key={article.id}>
                            <div className="col-sm-12">
                                <h4>{article.title ? article.title : null}</h4>
                                <span><p>{article.abstract ? article.abstract : null}</p></span>
                            </div>
                        </div>);
                    })}
                    </div>
                </aside>
                <h2 align="center">{this.state.errorMessage ? this.state.errorMessage : null}</h2>
            </main>
        </div>);
    }
}

export default Home;
