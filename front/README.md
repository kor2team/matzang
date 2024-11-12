#

React

## prefix

[initial] : repository를 생성하고 최초의 파일을 업로드 할 때<br>
[add] : 신규파일 추가<br>
[update] : code를 변경할 때<br>
[refactor] : code를 refactoring했을 때(버그 수정이나 기능 추가가 아님)<br>
[fix] : 잘못된 link정보 수정, 필요한 모듈 추가 및 삭제<br>
[remove] : 파일 제거<br>
[style] : 디자인 관련 변경사항<br>
[docs] : 문서 관련 변경(README.md수정)<br>

### 11/06 추가내용

1. 게시물 작성 페이지 수정
2. 로그인한 이메일 버튼 눌렀을 때 회원정보 관리 페이지 추가
3. 검색 페이지에 정확순, 최신순 기능 추가(db로 작성 날짜 저장할 경우 사용)
4. 모든 css파일 tailwind css로 변경
5. 로그인 페이지에서 회원가입 페이지 추가
6. footer 적용
7. 반응형 적용

### front 기능 정리

1. 레시피(/) : MainPage<br>

   - 레시피 목록을 보여주고 레시피 박스를 click하면 modal로 [이미지,제목,재료,조리방법]을 알려줌
     <br>

2. 검색(/search) : SearchPage<br>

   - 재료, 조리방식 별로 check박스 modal을 사용해서 레시피를 나열해주고 click 시 레시피 정보 modal창이 뜸
     <br>

3. 게시물(/board) : PostList<br>

   - 레시피 이름으로 검색이 가능하고, 전체 글 보기에서 레시피 박스를 click하면 modal로 레시피 정보[이미지,제목,레시피설명,재료,조리방법]을 알려줌
     <br>
   - 게시물 수정 button을 누르면 레시피 수정 페이지로 이동 / 삭제 button 아직 구현 안함
     <br>
   - 좋아요 button을 누르고 취소 가능
     <br>
   - 댓글 button을 누르면 댓글을 작성하고 수정,삭제까지 가능
     <br>
   - 내가 쓴글, 좋아요한 글 보기도 동일 => `수정필요`
     <br>
   - 게시물 작성 button을 누르면 레시피 작성 페이지로 이동
     <br>
   - modal component : PostModal

4. 레시피 작성 : CreatePost<br>

   - 레시피명, 레시피 간략소개, 이미지 첨부, 재료, 조리 과정 작성 후 `저장하기`로 저장하고 돌아가기, `돌아가기`로 저장 안하고 돌아가기
     <br>

5. 레시피 수정 : UpdatePost<br>

   - 작성 페이지와 동일, 원래 있던 레시피 정보 띄워줌
     <br>

6. 개인정보(/profile) : ProfilePage<br>

   - 이메일 정보, 비밀번호 변경, 로그아웃 기능
     <br>

7. 로그인(login) : LoginPage<br>
   - 이메일, 비밀번호를 사용하여 로그인
     <br>
   - `회원가입` : 이메일, 비밀번호, 비밀번호 확인, 닉네임을 입력하여 회원가입<br>

### 할일

1. api연동
2. modal

- 조리방법에 대한 무한스크롤
- 댓글 쓴 user의 username, 게시물 작성한 user의 username추가

3. 게시물 필터링 제거(back에서 구현)
4. 로그인 했을 때 페이지 상단에 username 띄우기
