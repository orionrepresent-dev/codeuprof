import hashlib
from datetime import datetime

class SymbolicEngine:
    def __init__(self):
        # Basic Papus / Tarot mapping for MVP
        self.major_arcana = [
            "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador", 
            "O Hierofante", "Os Enamorados", "O Carro", "A Justiça", "O Eremita", 
            "A Roda da Fortuna", "A Força", "O Enforcado", "A Morte", "A Temperança", 
            "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"
        ]
        self.elements = ["Fogo", "Terra", "Ar", "Água"]

    def _reduce_to_single_digit(self, number: int) -> int:
        """Theosophical reduction - reduce numbers to a single digit"""
        if number == 0: return 0
        rem = number % 9
        return rem if rem != 0 else 9

    def _calculate_numerology(self, dob: str, name: str) -> int:
        """Layer 1: Structural Numerology (Date of birth + Name)"""
        # Ex: "1990-01-01" -> 1+9+9+0+0+1+0+1 = 21 -> 3
        # Extract digits from the DOB string (assuming YYYY-MM-DD format usually)
        dob_digits = sum(int(d) for d in dob if d.isdigit())
        # Simple letter sum A=1, B=2 etc
        name_val = sum(ord(c.lower()) - 96 for c in name if c.isalpha())
        
        return self._reduce_to_single_digit(dob_digits + name_val)

    def _calculate_natal_arcana(self, dob: str) -> str:
        """Layer 2: Natal Arcana using simple Papus Formula (modulo 22) for the MVP"""
        dob_digits = sum(int(d) for d in dob if d.isdigit())
        arcana_index = dob_digits % 22
        return self.major_arcana[arcana_index]

    def _get_archetypal_signature(self, arcana: str) -> dict:
        """Layer 3: Archetypal Signature combining Arcana and an implicit elemental force"""
        # Pseudo-mapping Element using arcana length for the MVP
        element = self.elements[len(arcana) % 4]
        return {"arcana": arcana, "element": element}

    def _generate_psychological_profile(self, name: str, element: str) -> dict:
        """Layer 4: Adaptive psychological profile input via MVP Jungian/PNL concepts"""
        # Mappings for MVP purposes based on the element
        traits = {
            "Fogo": ("Intuição", "Extroversão"),
            "Terra": ("Sensação", "Introversão"),
            "Ar": ("Pensamento", "Extroversão"),
            "Água": ("Sentimento", "Introversão")
        }
        jungian_type, energy = traits.get(element, ("Misto", "Ambivertido"))
        return {"jungian_type": jungian_type, "energy_direction": energy}

    def generate_symbolic_hash(self, name: str, dob: str) -> dict:
        """
        Synthesizes the 4 layers into a Unique Symbolic Hash.
        Returns the data map with the hash and isolated layers for UI use.
        """
        try:
            # Layer 1
            numerology = self._calculate_numerology(dob, name)
            # Layer 2
            arcana = self._calculate_natal_arcana(dob)
            # Layer 3
            signature = self._get_archetypal_signature(arcana)
            # Layer 4
            psy_profile = self._generate_psychological_profile(name, signature["element"])

            # 5. Compile into Vibrational Hash using SHA-256 for Privacy by Design
            raw_string = f"{name}{dob}{numerology}{arcana}{signature['element']}{psy_profile['jungian_type']}"
            symbolic_hash = hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

            return {
                "user": {"name": name, "dob": dob},
                "symbolic_hash": symbolic_hash,
                "layer_1_numerology": numerology,
                "layer_2_natal_arcana": arcana,
                "layer_3_archetypal_signature": signature,
                "layer_4_psychological_profile": psy_profile
            }
        except Exception as e:
            return {"error": str(e)}

    def save_revelation(self, hash_data: dict, maestro_insight: dict) -> dict:
        """
        Saves the successful revelation (analysis results) to Supabase.
        Uses graceful degradation if Supabase is not configured.
        """
        from core.supabase_client import supabase
        
        try:
            if not supabase:
                return {"status": "skipped", "message": "Supabase client not initialized"}
            
            payload = {
                "symbolic_hash": hash_data.get("symbolic_hash"),
                "user_name": hash_data.get("user", {}).get("name"),
                "dob": hash_data.get("user", {}).get("dob"),
                "natal_arcana": hash_data.get("layer_2_natal_arcana"),
                "insight": maestro_insight,
                "created_at": datetime.utcnow().isoformat()
            }
            
            response = supabase.table("analysis_history").insert(payload).execute()
            return {"status": "success", "data": response.data}
        except Exception as e:
            print(f"Failed to save revelation to Supabase: {e}")
            return {"status": "error", "error": str(e)}

# Singleton instance ready
engine = SymbolicEngine()
