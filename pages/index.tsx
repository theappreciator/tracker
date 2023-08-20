export default function Home() {
  return (
    <div>hi</div>
  )
}

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/u',
      permanent: false
    }
  };
}
