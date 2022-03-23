import React from 'react';
import { useQuery } from '@apollo/client'; //hook
import { QUERY_THOUGHTS } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import { title } from 'faker/lib/locales/az';

const Home = () => {
  // use useQuery hook to make query request

  const { data, loading  } = useQuery(QUERY_THOUGHTS)

  // optimal chaining-new feature that browsers can support. tyoe data.thoughts if it exsists it will be stored in the thoughts constant we just created. if data is undefined, then save an empty array to the thoughts component.
  const thoughts = data?.thoughts || [];
  console.log(thoughts)
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ThoughtList thoughts = {thoughts} title = "Some geed for thoughts" />
        )} 
        </div>
      </div>
    </main>
  );
};

export default Home;
