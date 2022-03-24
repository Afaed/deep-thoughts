import React from 'react';
import { useQuery } from '@apollo/client'; //hook
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import { title } from 'faker/lib/locales/az';
import Auth from '../utils/auth'
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm'

const Home = () => {
  // use useQuery hook to make query request

  const { data, loading  } = useQuery(QUERY_THOUGHTS)

  // optimal chaining-new feature that browsers can support. tyoe data.thoughts if it exsists it will be stored in the thoughts constant we just created. if data is undefined, then save an empty array to the thoughts component.
  const thoughts = data?.thoughts || [];
  console.log(thoughts)

  const loggedIn =Auth.loggedIn()

  //object destructuring to extract data from usequery Hook's response and rename it `userData` to be more descriptive

  const { data: userData } = useQuery(QUERY_ME_BASIC)

  return (
    <main>
      <div className='flex-row justify-space-between'>
        {loggedIn && (
          <div className = "col-12 mb-3">
            <ThoughtForm />
          </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ThoughtList thoughts = {thoughts} title = "Some feed for thoughts" />
        )} 
        </div>
      </div>
      {loggedIn && userData ? (
        <div className="col-12 col-lg-3 mb-3">
          <FriendList 
          username = {userData.me.username}
          friendCount={userData.me.friendCount}
          friends = {userData.me.friends}
          />
        </div>
      ) : null}
    </main>
  );
};

export default Home;
