import google.generativeai as genai
from app.config import settings
from app.schemas.recommendation import RecommendationBase
import json

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

async def generate_book_recommendations(title: str, author: str, language: str = "tr") -> list[RecommendationBase]:
    prompt_tr = f"""
    Siz bir kitap öneri uzmanısınız. "{title}" adlı kitaba ve "{author}" yazarına dayanarak,

    3 benzer kitap önerin.

    Yanıtı kesinlikle şu anahtarlara sahip nesnelerden oluşan bir JSON dizisi olarak döndürün:

    - "recommended_title": Kitabın başlığı
    - "recommended_author": Kitabın yazarı
    - "recommendation_reason": Referans kitaba dayanarak neden önerildiğine dair ayrıntılı bir açıklama (2-3 cümle).

    Markdown biçimlendirmesi (örneğin ```json`) eklemeyin. Sadece JSON dizisini gönderin."""

    prompt_en = f"""
    You are a book recommendation expert. Based on the book "{title}" by {author}, 
    recommend 3 similar books.
    
    Return the response strictly as a JSON array of objects with these keys:
    - "recommended_title": The title of the book
    - "recommended_author": The author of the book
    - "recommendation_reason": A detailed explanation (2-3 sentences) why it is recommended based on the reference book.
    
    Do not include markdown formatting (like ```json). Just the JSON array.
    """
    
    selected_prompt = prompt_en if language == "en" else prompt_tr

    try:
        # Check if generate_content_async exists in installed version, otherwise fallback to sync in threadpool?
        # Version 0.3.2+ supports async
        response = await model.generate_content_async(selected_prompt)
        text = response.text.strip()
        
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        text = text.strip()
        data = json.loads(text)
        
        recommendations = []
        for item in data:
            recommendations.append(RecommendationBase(
                recommended_title=item["recommended_title"],
                recommended_author=item["recommended_author"],
                recommendation_reason=item["recommendation_reason"]
            ))
        return recommendations
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        raise e
