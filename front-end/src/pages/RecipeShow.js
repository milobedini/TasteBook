import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/recipeShow.css'
import { FaStar } from 'react-icons/fa'
import StarRating from '../components/comments/StarRating'
import Comments from '../components/comments/Comments'
import Likes from '../components/likes/Likes'
import { getToken } from '../helpers/auth'
import DeleteRecipe from '../components/DeleteRecipe'
import { getUser } from '../helpers/auth'
import { getAxiosDeleteRequestConfig } from '../helpers/api'
const RecipeShow = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const name = getUser()
  useEffect(() => {
    if (getToken()) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const [recipe, setRecipe] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [method, setMethod] = useState([])
  const [reviews, setReviews] = useState([])
  const { id } = useParams()

  async function fetchRecipe(id) {
    const config = {
      method: 'get',
      url: `/api/recipes/${id}`,
      headers: {},
    }

    const response = await axios(config)
    setRecipe(response.data)
    setIngredients(response.data.ingredients)
    setMethod(response.data.method)
    setReviews(response.data.comments)
  }
  useEffect(() => {
    fetchRecipe(id)
  }, [id])
  const handleClose = async (commentId) => {
    try {
      const config = getAxiosDeleteRequestConfig(
        `/recipes/${id}/comments/${commentId}`
      )
      const response = await axios(config).catch(() => console.log('not cool'))
      console.log(response)
      if (response.status > 199 && response.status < 300) {
        fetchRecipe(id)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <section className="wrapper">
      <div className="delete">
        <DeleteRecipe isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
      <div className="top_section">
        <div className="info">
          <h2 className="top_section_text">{recipe.name}</h2>
          <p className="top_section_text">
            Average Rating: {recipe.averageRating}
          </p>
          <p className="top_section_text">
            Preparation Time: {recipe.prepTime}
          </p>
          <p className="top_section_text">Cook Time: {recipe.cookTime}</p>
          <p className="top_section_text">Servings: {recipe.servings}</p>
          <p className="top_section_text">Calories: {recipe.calories}</p>
        </div>
        <div>
          <img src={recipe.image} alt={recipe.name} />
        </div>
      </div>
      <div className="ingredients_and_method">
        <div className="recipe_ingredients">
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>
                <p>{ingredient}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="recipe_method">
          <h3>Method</h3>
          <ul>
            {method.map((step) => (
              <li key={step}>
                <p>{step}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <div className="leave_review_section">
          <div className="leave_review">
            <h3>Leave a Review</h3>
            <form>
              <input type="text" placeholder="Tell us what you think" />
            </form>
          </div>
          <div className="rating_section">
            <div>
              <h3>How Would You Rate {recipe.name} ?</h3>
            </div>
            <div className="rate_star">
              <div>
                <StarRating />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="recipe_reviews">
        <div className="reviews">
          <h3>Reviews ({reviews.length})</h3>
          <div className="review">
            <ul>
              {reviews.map((review) => {
                console.log(review)
                return (
                  <li>
                    <div className="review_table_top">
                      <div className="comment_author">
                        <p>{review.username}</p>
                      </div>
                      <div>
                        <p>
                          {Array(review.rating).fill(<FaStar />)}
                          {/* gave this recipe {review.rating}/5 <FaStar /> */}
                        </p>
                      </div>
                      {name === review.username ? (
                        <span onClick={(e) => handleClose(review._id)}>
                          &times;
                        </span>
                      ) : null}
                    </div>
                    <p>{review.text}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <Comments refetch={() => fetchRecipe(id)} />
      </div>
      <div>
        <Likes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
    </section>
  )
}
export default RecipeShow
