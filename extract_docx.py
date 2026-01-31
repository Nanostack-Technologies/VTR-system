import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def get_docx_text(path):
    if not os.path.exists(path):
        return f"File not found: {path}"
    document_text = []
    try:
        with zipfile.ZipFile(path) as document:
            xml_content = document.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Find all text elements
            # The namespace map is often needed, but simple iteration works for just text
            for elem in tree.iter():
                # w:t is the tag for text
                if elem.tag.endswith('}t'):
                    if elem.text:
                        document_text.append(elem.text)
                # w:p for paragraph breaks
                elif elem.tag.endswith('}p'):
                    document_text.append('\n')
                # w:br for line breaks
                elif elem.tag.endswith('}br'):
                    document_text.append('\n')
    except Exception as e:
        return f"Error reading docx: {e}"
        
    return ''.join(document_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <path_to_docx>")
    else:
        path = sys.argv[1]
        print(get_docx_text(path))
