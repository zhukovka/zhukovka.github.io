import * as React from 'react'
import {graphql, type PageProps} from 'gatsby'
import Layout from '../components/layout'
import Seo from '../components/seo'

interface NodeType {
    name: string;
    birthTime: string;
}

interface BlogPageData {
    allFile: {
        nodes: NodeType[]
    }
}

const BlogPage = ({data}: PageProps<BlogPageData>) => {
    return (
        <Layout pageTitle="My Blog Posts">
            <ul>
                {
                    data.allFile.nodes.map((node: NodeType) => (
                        <li key={node.name}>
                            {node.name}
                        </li>
                    ))
                }
            </ul>
        </Layout>
    )
}

export const query = graphql`
query {
  allFile(filter: {sourceInstanceName: {eq: "blog"}}) {
    nodes {
      name
      birthTime(fromNow: true)
    }
  }
}`

export const Head = () => <Seo title="My Blog Posts"/>

export default BlogPage