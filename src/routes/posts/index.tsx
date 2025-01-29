import type { Post } from '@/types/Post'
import { minutesSince } from '@/utils/minutesSince'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
export const Route = createFileRoute('/posts/')({
  component: App,
})

function App() {
  // Make get request to /api/posts
  // Can filter by relic id
  //
  const [posts, setPosts] = useState<
    (Post & {
      tier: string
      relic_name: string
      username: string
    })[]
  >([])

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error(`Response status ${response.status}`)
      }
      const postsJson = await response.json()
      console.log(postsJson)
      setPosts(postsJson)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      // setIsLoading(false)
      console.log('Posts fetched')
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])
  return (
    <main>
      <h1 id="title">Warframe Relic LFG Active Posts</h1>

      <table>
        <thead>
          <tr>
            <th>Relic</th>
            <th>Open Slots</th>
            <th>Updated</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {posts
            .toSorted((a, b) => a.updated_at - b.updated_at)
            .map((post) => (
              <tr key={post.post_id}>
                <td>{`${post.tier} ${post.relic_name}`}</td>
                <td>{post.open_slots}</td>
                <td>{minutesSince(post.updated_at)} mins ago</td>
                <td>{post.username}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="resultsGrid">
        <div className="resultsGrid_header">
          <span>Relic</span>
          <span>open slots</span>
          <span>updated</span>
          <span>username</span>
        </div>
        <hr />
        <ul className="resultsGrid_body">
          {posts
            .toSorted((a, b) => a.updated_at - b.updated_at)
            .map((post) => (
              <li className="resultsGrid_row" key={post.post_id}>
                <span>{`${post.tier} ${post.relic_name}`}</span>
                <span>{post.open_slots}</span>
                <span>{minutesSince(post.updated_at)} mins ago</span>
                <span>{post.username}</span>
              </li>
            ))}
        </ul>
        <hr />
      </div>
    </main>
  )
}

export default App
