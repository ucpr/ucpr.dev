import { useParams } from "@solidjs/router";

const Article = () => {
  const params = useParams();

  return (
    <div>
      <h1>Article</h1>
      <p>{params.id}</p>
    </div>
  );
}

export default Article;
